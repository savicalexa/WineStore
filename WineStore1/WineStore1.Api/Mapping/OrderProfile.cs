using AutoMapper;
using WineStore1.Api.Dtos;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Mapping;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<OrderItem, OrderItemReadDto>()
            .ForMember(d => d.WineName, m => m.MapFrom(s => s.Wine.Name))
            .ForMember(d => d.Subtotal, m => m.MapFrom(s => s.UnitPrice * s.Quantity));

        CreateMap<OrderItemCreateDto, OrderItem>();
        CreateMap<OrderItemUpdateDto, OrderItem>();

        CreateMap<Order, OrderReadDto>()
            .ForMember(d => d.UserEmail, m => m.MapFrom(s => s.User.Email))
            .ForMember(d => d.Items, m => m.MapFrom(s => s.OrderItems.ToList()));
    }
}
