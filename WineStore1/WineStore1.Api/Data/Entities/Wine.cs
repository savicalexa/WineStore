using System;
using System.Collections.Generic;

namespace WineStore1.Api.Data.Entities;

public partial class Wine
{
    public long WineId { get; set; }

    public string Name { get; set; } = null!;

    public short? Year { get; set; }

    public decimal? AlcoholPercentage { get; set; }

    public int VolumeMl { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public long CategoryId { get; set; }

    public long WineryId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual WineCategory Category { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Winery Winery { get; set; } = null!;
}
