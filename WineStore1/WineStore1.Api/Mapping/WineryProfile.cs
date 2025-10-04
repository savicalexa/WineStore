using AutoMapper;
using WineStore1.Api.Dtos;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Mapping
{
    public class WineryProfile : Profile
    {
        public WineryProfile()
        {
            CreateMap<Winery, WineryReadDto>();
            CreateMap<WineryCreateDto, Winery>();
            CreateMap<WineryUpdateDto, Winery>();
        }
    }
}
