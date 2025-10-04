using AutoMapper;
using WineStore1.Api.Dtos;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserReadDto>();

            // Napomena:
            // Za kreiranje/izmenu korisnika obično želiš da hash-uješ lozinku u servisu,
            // pa onda mapiraš u entitet. Zbog toga ovde nemamo Create/Update mapu.
        }
    }
}
