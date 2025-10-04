using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public OrdersController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll()
    {
        var orders = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(i => i.Wine)
            .AsNoTracking()
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<OrderReadDto>>(orders));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<OrderReadDto>> GetOne(long id)
    {
        var order = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(i => i.Wine)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.OrderId == id);

        return order is null ? NotFound() : Ok(_mapper.Map<OrderReadDto>(order));
    }

    [HttpPost]
    public async Task<ActionResult<OrderReadDto>> Create(OrderCreateDto dto)
    {
        var exists = await _db.Users.AnyAsync(u => u.UserId == dto.UserId);
        if (!exists) return BadRequest(new { message = "User not found" });

        var order = new Order
        {
            UserId = dto.UserId,
            ShippingAddress = dto.ShippingAddress,
            BillingAddress = dto.BillingAddress,
            Status = "Pending"
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        if (dto.Items != null)
        {
            foreach (var item in dto.Items)
            {
                _db.OrderItems.Add(new OrderItem
                {
                    OrderId = order.OrderId,
                    WineId = item.WineId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                });
            }
            await _db.SaveChangesAsync();
        }

        var read = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(i => i.Wine)
            .FirstAsync(o => o.OrderId == order.OrderId);

        return CreatedAtAction(nameof(GetOne), new { id = order.OrderId }, _mapper.Map<OrderReadDto>(read));
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, OrderUpdateDto dto)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == id);
        if (order is null) return NotFound();

        order.Status = dto.Status;
        order.ShippingAddress = dto.ShippingAddress;
        order.BillingAddress = dto.BillingAddress;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var entity = await _db.Orders.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Orders.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
