namespace WineStore1.Api.Dtos;

public record OrderReadDto(
    long OrderId,
    long UserId,
    string UserEmail,
    DateTime OrderDate,
    string Status,
    decimal TotalAmount,
    string ShippingAddress,
    string? BillingAddress,
    DateTime UpdatedAt,
    IReadOnlyList<OrderItemReadDto> Items);

public record OrderCreateDto(
    long UserId,
    string ShippingAddress,
    string? BillingAddress,
    // opcionalno inicijalne stavke:
    IReadOnlyList<OrderItemCreateDto>? Items);

public record OrderUpdateDto(
    string Status,
    string ShippingAddress,
    string? BillingAddress);
