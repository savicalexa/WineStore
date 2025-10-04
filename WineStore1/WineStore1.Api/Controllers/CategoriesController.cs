using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public CategoriesController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryReadDto>>> GetAll()
    {
        var items = await _db.WineCategories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync();

        var dto = _mapper.Map<IEnumerable<CategoryReadDto>>(items);
        return Ok(dto);
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<CategoryReadDto>> GetOne(long id)
    {
        var entity = await _db.WineCategories.AsNoTracking()
            .FirstOrDefaultAsync(c => c.CategoryId == id);

        return entity is null
            ? NotFound()
            : Ok(_mapper.Map<CategoryReadDto>(entity));
    }

    [HttpPost]
    public async Task<ActionResult<CategoryReadDto>> Create([FromBody] CategoryCreateDto dto)
    {
        var exists = await _db.WineCategories.AnyAsync(c => c.Name == dto.Name);
        if (exists) return Conflict(new { message = "Category name already exists." });

        var entity = _mapper.Map<WineCategory>(dto);
        _db.WineCategories.Add(entity);
        await _db.SaveChangesAsync();

        var read = _mapper.Map<CategoryReadDto>(entity);
        return CreatedAtAction(nameof(GetOne), new { id = entity.CategoryId }, read);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] CategoryUpdateDto dto)
    {
        var entity = await _db.WineCategories.FirstOrDefaultAsync(c => c.CategoryId == id);
        if (entity is null) return NotFound();

        if (!string.Equals(entity.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
        {
            var nameTaken = await _db.WineCategories.AnyAsync(c => c.Name == dto.Name);
            if (nameTaken) return Conflict(new { message = "Category name already exists." });
        }

        _mapper.Map(dto, entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var entity = await _db.WineCategories
            .Include(c => c.Wines)
            .FirstOrDefaultAsync(c => c.CategoryId == id);

        if (entity is null) return NotFound();
        if (entity.Wines?.Any() == true)
            return Conflict(new { message = "Category has wines and cannot be deleted." });

        _db.WineCategories.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:long}/wines")]
    public async Task<IActionResult> GetWines(
        long id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null)
    {
        var exists = await _db.WineCategories.AsNoTracking()
            .AnyAsync(c => c.CategoryId == id);
        if (!exists) return NotFound(new { message = "Category not found." });

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Wines
            .AsNoTracking()
            .Include(w => w.Category)
            .Include(w => w.Winery)
            .Where(w => w.CategoryId == id);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = $"%{q.Trim()}%";
            query = query.Where(w =>
                EF.Functions.Like(w.Name, term) ||
                (w.Description != null && EF.Functions.Like(w.Description, term)) ||
                EF.Functions.Like(w.Winery.Name, term));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(w => w.WineId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var data = _mapper.Map<IEnumerable<WineReadDto>>(items);
        return Ok(new { total, page, pageSize, data });
    }
}
