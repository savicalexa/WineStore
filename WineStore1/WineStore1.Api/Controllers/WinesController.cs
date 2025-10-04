using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WinesController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public WinesController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    /// <summary>
    /// Listanje vina (paginirano + filteri: q, categoryId, wineryId, minPrice, maxPrice).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] long? categoryId = null,
        [FromQuery] long? wineryId = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<Wine> query = _db.Wines
            .AsNoTracking()
            .Include(w => w.Category)
            .Include(w => w.Winery);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = $"%{q.Trim()}%";
            query = query.Where(w =>
                EF.Functions.Like(w.Name, term) ||
                (w.Description != null && EF.Functions.Like(w.Description, term)) ||
                EF.Functions.Like(w.Category.Name, term) ||
                EF.Functions.Like(w.Winery.Name, term));
        }

        if (categoryId is not null) query = query.Where(w => w.CategoryId == categoryId);
        if (wineryId is not null) query = query.Where(w => w.WineryId == wineryId);
        if (minPrice is not null) query = query.Where(w => w.Price >= minPrice);
        if (maxPrice is not null) query = query.Where(w => w.Price <= maxPrice);

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(w => w.WineId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var data = _mapper.Map<IEnumerable<WineReadDto>>(items);
        return Ok(new { total, page, pageSize, data });
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<WineReadDto>> GetOne(long id)
    {
        var wine = await _db.Wines
            .AsNoTracking()
            .Include(w => w.Category)
            .Include(w => w.Winery)
            .FirstOrDefaultAsync(w => w.WineId == id);

        return wine is null ? NotFound() : Ok(_mapper.Map<WineReadDto>(wine));
    }

    [HttpPost]
    public async Task<ActionResult<WineReadDto>> Create([FromBody] WineCreateDto dto)
    {
        var catExists = await _db.WineCategories.AnyAsync(c => c.CategoryId == dto.CategoryId);
        var winExists = await _db.Wineries.AnyAsync(w => w.WineryId == dto.WineryId);
        if (!catExists) return BadRequest(new { message = "Category not found." });
        if (!winExists) return BadRequest(new { message = "Winery not found." });

        var entity = _mapper.Map<Wine>(dto);
        _db.Wines.Add(entity);
        await _db.SaveChangesAsync();

        await _db.Entry(entity).Reference(w => w.Category).LoadAsync();
        await _db.Entry(entity).Reference(w => w.Winery).LoadAsync();

        var read = _mapper.Map<WineReadDto>(entity);
        return CreatedAtAction(nameof(GetOne), new { id = entity.WineId }, read);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] WineUpdateDto dto)
    {
        var entity = await _db.Wines.FirstOrDefaultAsync(w => w.WineId == id);
        if (entity is null) return NotFound();

        var catExists = await _db.WineCategories.AnyAsync(c => c.CategoryId == dto.CategoryId);
        var winExists = await _db.Wineries.AnyAsync(w => w.WineryId == dto.WineryId);
        if (!catExists) return BadRequest(new { message = "Category not found." });
        if (!winExists) return BadRequest(new { message = "Winery not found." });

        _mapper.Map(dto, entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var entity = await _db.Wines.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Wines.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
