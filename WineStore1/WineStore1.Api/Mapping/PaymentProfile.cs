using AutoMapper;
using WineStore1.Api.Dtos;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Mapping;

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        CreateMap<Payment, PaymentReadDto>();
        CreateMap<PaymentCreateDto, Payment>()
            .ForMember(d => d.Provider, m => m.MapFrom(_ => "Stripe"))      // default
            .ForMember(d => d.Status, m => m.MapFrom(_ => "Pending"));    // default
    }
}
