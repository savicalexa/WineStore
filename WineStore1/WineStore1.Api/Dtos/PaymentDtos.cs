namespace WineStore1.Api.Dtos;

public record PaymentReadDto(
    long PaymentId,
    long OrderId,
    string Provider,
    decimal Amount,
    string Currency,
    DateTime PaymentDate,
    string PaymentMethod,
    string Status,
    string? TransactionReference,
    string? Metadata,
    string? StripePaymentIntentId,
    string? StripePaymentMethodId,
    string? StripeChargeId,
    string? StripeCustomerId,
    string? StripeReceiptUrl,
    DateTime? CapturedAt,
    decimal RefundedAmount);

public record PaymentCreateDto(
    long OrderId,
    decimal Amount,
    string Currency,
    string PaymentMethod);

public record PaymentUpdateStatusDto(
    string Status,
    decimal? RefundedAmount);
