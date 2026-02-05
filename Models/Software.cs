using Postgrest.Attributes;
using Postgrest.Models;

namespace SominnercoreNew.Models;

[Table("softwares")]
public class Software : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; } = "";

    [Column("name")]
    public string Name { get; set; } = "";

    [Column("short_description")]
    public string? ShortDescription { get; set; }

    [Column("full_description")]
    public string? FullDescription { get; set; }

    [Column("version")]
    public string Version { get; set; } = "";

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("category")]
    public string? Category { get; set; }

    [Column("icon_color")]
    public string IconColor { get; set; } = "#3b82f6";

    [Column("active_users")]
    public int ActiveUsers { get; set; }

    [Column("total_downloads")]
    public int TotalDownloads { get; set; }

    [Column("release_date")]
    public string? ReleaseDate { get; set; }

    [Column("visibility")]
    public string Visibility { get; set; } = "public";

    [Column("created_at")]
    public string? CreatedAt { get; set; }

    [Column("updated_at")]
    public string? UpdatedAt { get; set; }
}
