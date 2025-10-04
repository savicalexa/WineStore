namespace WineStore1.Api.Dtos;

public record WineReadDto(
    long WineId,
    string Name,
    short? Year,
    decimal? AlcoholPercentage,
    int VolumeMl,
    decimal Price,
    int StockQuantity,
    string? Description,
    string? ImageUrl,
    long CategoryId,
    string CategoryName,
    long WineryId,
    string WineryName,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record WineCreateDto(
    string Name,
    short? Year,
    decimal? AlcoholPercentage,
    int VolumeMl,
    decimal Price,
    int StockQuantity,
    string? Description,
    string? ImageUrl,
    long CategoryId,
    long WineryId);

public record WineUpdateDto(
    string Name,
    short? Year,
    decimal? AlcoholPercentage,
    int VolumeMl,
    decimal Price,
    int StockQuantity,
    string? Description,
    string? ImageUrl,
    long CategoryId,
    long WineryId);
