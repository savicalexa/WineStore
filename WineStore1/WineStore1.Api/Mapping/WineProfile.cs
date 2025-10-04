using AutoMapper;
using WineStore1.Api.Dtos;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Mapping;

public class WineProfile : Profile
{
    public WineProfile()
    {
        CreateMap<Wine, WineReadDto>()
            .ForMember(d => d.CategoryName, m => m.MapFrom(s => s.Category.Name))
            .ForMember(d => d.WineryName, m => m.MapFrom(s => s.Winery.Name));

        CreateMap<WineCreateDto, Wine>();
        CreateMap<WineUpdateDto, Wine>();
    }
}
