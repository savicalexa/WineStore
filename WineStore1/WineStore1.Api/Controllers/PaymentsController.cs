using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public PaymentsController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet("{orderId:long}")]
    public async Task<ActionResult<PaymentReadDto>> GetForOrder(long orderId)
    {
        var entity = await _db.Payments.AsNoTracking().FirstOrDefaultAsync(p => p.OrderId == orderId);
        return entity is null ? NotFound() : Ok(_mapper.Map<PaymentReadDto>(entity));
    }

    [HttpPost]
    public async Task<ActionResult<PaymentReadDto>> Create(PaymentCreateDto dto)
    {
        var orderExists = await _db.Orders.AnyAsync(o => o.OrderId == dto.OrderId);
        if (!orderExists) return BadRequest(new { message = "Order not found" });

        var entity = _mapper.Map<Payment>(dto);
        _db.Payments.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetForOrder), new { orderId = entity.OrderId }, _mapper.Map<PaymentReadDto>(entity));
    }

    [HttpPut("{id:long}/status")]
    public async Task<IActionResult> UpdateStatus(long id, PaymentUpdateStatusDto dto)
    {
        var entity = await _db.Payments.FirstOrDefaultAsync(p => p.PaymentId == id);
        if (entity is null) return NotFound();

        entity.Status = dto.Status;
        if (dto.RefundedAmount is not null) entity.RefundedAmount = dto.RefundedAmount.Value;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
