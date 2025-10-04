using System;
using System.Collections.Generic;

namespace WineStore1.Api.Data.Entities;

public partial class Payment
{
    public long PaymentId { get; set; }

    public long OrderId { get; set; }

    public string Provider { get; set; } = null!;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = null!;

    public DateTime PaymentDate { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string? TransactionReference { get; set; }

    public string? Metadata { get; set; }

    public string? StripePaymentIntentId { get; set; }

    public string? StripePaymentMethodId { get; set; }

    public string? StripeChargeId { get; set; }

    public string? StripeCustomerId { get; set; }

    public string? StripeReceiptUrl { get; set; }

    public DateTime? CapturedAt { get; set; }

    public decimal RefundedAmount { get; set; }

    public virtual Order Order { get; set; } = null!;
}
