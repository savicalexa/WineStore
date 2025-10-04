using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Context;
using WineStore1.Api.Data.Entities;
using WineStore1.Api.Dtos;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IMapper _mapper;

    public WebhooksController(WineStoreContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WebhookEventReadDto>>> GetAll()
    {
        var events = await _db.StripeWebhookEvents.AsNoTracking().OrderByDescending(e => e.ReceivedAt).ToListAsync();
        return Ok(_mapper.Map<IEnumerable<WebhookEventReadDto>>(events));
    }

    [HttpPost]
    public async Task<IActionResult> Receive(WebhookEventCreateDto dto)
    {
        var entity = _mapper.Map<StripeWebhookEvent>(dto);
        _db.StripeWebhookEvents.Add(entity);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
