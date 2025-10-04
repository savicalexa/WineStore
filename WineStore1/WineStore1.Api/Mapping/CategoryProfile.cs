using AutoMapper;
using WineStore1.Api.Dtos;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Mapping
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<WineCategory, CategoryReadDto>();

            CreateMap<CategoryCreateDto, WineCategory>();
            CreateMap<CategoryUpdateDto, WineCategory>();
        }
    }
}
