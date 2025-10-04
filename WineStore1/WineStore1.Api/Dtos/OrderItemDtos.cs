namespace WineStore1.Api.Dtos;

public record OrderItemReadDto(
    long OrderItemId,
    long OrderId,
    long WineId,
    string WineName,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal);

public record OrderItemCreateDto(
    long WineId,
    int Quantity,
    decimal UnitPrice);

public record OrderItemUpdateDto(
    long WineId,
    int Quantity,
    decimal UnitPrice);
