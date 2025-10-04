using System;
using System.Collections.Generic;

namespace WineStore1.Api.Data.Entities;

public partial class Winery
{
    public long WineryId { get; set; }

    public string Name { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string? Region { get; set; }

    public short? FoundedYear { get; set; }

    public string? Description { get; set; }

    public string? WebsiteUrl { get; set; }

    public string? LogoUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Wine> Wines { get; set; } = new List<Wine>();
}
