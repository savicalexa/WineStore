namespace WineStore1.Api.Dtos;

public record CategoryReadDto(
    long CategoryId,
    string Name,
    string? Description);

public record CategoryCreateDto(
    string Name,
    string? Description);

public record CategoryUpdateDto(
    string Name,
    string? Description);
