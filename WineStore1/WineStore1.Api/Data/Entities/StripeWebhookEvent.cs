using System;
using System.Collections.Generic;

namespace WineStore1.Api.Data.Entities;

public partial class StripeWebhookEvent
{
    public long Id { get; set; }

    public string ProviderEventId { get; set; } = null!;

    public string EventType { get; set; } = null!;

    public string Payload { get; set; } = null!;

    public bool SignatureVerified { get; set; }

    public DateTime ReceivedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public string ProcessStatus { get; set; } = null!;

    public string? ErrorMessage { get; set; }
}
