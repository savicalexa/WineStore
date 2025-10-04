namespace WineStore1.Api.Dtos;

public record WebhookEventReadDto(
    long Id,
    string ProviderEventId,
    string EventType,
    bool SignatureVerified,
    DateTime ReceivedAt,
    DateTime? ProcessedAt,
    string ProcessStatus,
    string? ErrorMessage);

public record WebhookEventCreateDto(
    string ProviderEventId,
    string EventType,
    string Payload,
    bool SignatureVerified);
