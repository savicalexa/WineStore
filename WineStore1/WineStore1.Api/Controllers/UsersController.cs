using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public UsersController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserReadDto>>> GetAll()
    {
        var users = await _db.Users.AsNoTracking().ToListAsync();
        return Ok(_mapper.Map<IEnumerable<UserReadDto>>(users));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<UserReadDto>> GetOne(long id)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);
        return user is null ? NotFound() : Ok(_mapper.Map<UserReadDto>(user));
    }

    [HttpPost]
    public async Task<ActionResult<UserReadDto>> Create(UserCreateDto dto)
    {
        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists) return Conflict(new { message = "Email already exists" });

        // plain password (po tvojoj želji)
        var entity = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = dto.Password,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role
        };

        _db.Users.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = entity.UserId }, _mapper.Map<UserReadDto>(entity));
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, UserUpdateDto dto)
    {
        var entity = await _db.Users.FirstOrDefaultAsync(u => u.UserId == id);
        if (entity is null) return NotFound();

        _mapper.Map(dto, entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var entity = await _db.Users.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Users.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
