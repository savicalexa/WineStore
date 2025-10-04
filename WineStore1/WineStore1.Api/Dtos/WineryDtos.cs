namespace WineStore1.Api.Dtos;

public record WineryReadDto(
    long WineryId,
    string Name,
    string Country,
    string? Region,
    short? FoundedYear,
    string? Description,
    string? WebsiteUrl,
    string? LogoUrl,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record WineryCreateDto(
    string Name,
    string Country,
    string? Region,
    short? FoundedYear,
    string? Description,
    string? WebsiteUrl,
    string? LogoUrl);

public record WineryUpdateDto(
    string Name,
    string Country,
    string? Region,
    short? FoundedYear,
    string? Description,
    string? WebsiteUrl,
    string? LogoUrl);
