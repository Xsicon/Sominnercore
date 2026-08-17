using Postgrest.Attributes;
using Postgrest.Models;

namespace KobNeti.Models;

[Table("page_contents")]
public class PageContent : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; } = "";

    [Column("slug")]
    public string Slug { get; set; } = "";

    [Column("title")]
    public string Title { get; set; } = "";

    [Column("content")]
    public string Content { get; set; } = "";

    [Column("updated_at")]
    public string? UpdatedAt { get; set; }
}
