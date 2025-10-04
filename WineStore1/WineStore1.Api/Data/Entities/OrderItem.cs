﻿using System;
using System.Collections.Generic;

namespace WineStore1.Api.Data.Entities;

public partial class OrderItem
{
    public long OrderItemId { get; set; }

    public long OrderId { get; set; }

    public long WineId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal? Subtotal { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Wine Wine { get; set; } = null!;
}
