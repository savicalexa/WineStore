using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WineriesController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public WineriesController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WineryReadDto>>> GetAll()
    {
        var wineries = await _db.Wineries.AsNoTracking().ToListAsync();
        return Ok(_mapper.Map<IEnumerable<WineryReadDto>>(wineries));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<WineryReadDto>> GetOne(long id)
    {
        var entity = await _db.Wineries.AsNoTracking().FirstOrDefaultAsync(w => w.WineryId == id);
        return entity is null ? NotFound() : Ok(_mapper.Map<WineryReadDto>(entity));
    }

    [HttpPost]
    public async Task<ActionResult<WineryReadDto>> Create(WineryCreateDto dto)
    {
        var entity = _mapper.Map<Winery>(dto);
        _db.Wineries.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOne), new { id = entity.WineryId }, _mapper.Map<WineryReadDto>(entity));
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, WineryUpdateDto dto)
    {
        var entity = await _db.Wineries.FirstOrDefaultAsync(w => w.WineryId == id);
        if (entity is null) return NotFound();

        _mapper.Map(dto, entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var entity = await _db.Wineries.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Wineries.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
