using System;
using System.Collections.Generic;

namespace WineStore1.Api.Data.Entities;

public partial class WineCategory
{
    public long CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Wine> Wines { get; set; } = new List<Wine>();
}
