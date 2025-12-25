using System.Text.Json.Serialization;

namespace Sominnercore.Models;

public record ProjectDto(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("client")] string? Client,
    [property: JsonPropertyName("budget")] decimal? Budget,
    [property: JsonPropertyName("due_date")] DateTime? DueDate,
    [property: JsonPropertyName("icon")] string? Icon,
    [property: JsonPropertyName("icon_color")] string? IconColor,
    [property: JsonPropertyName("is_public")] bool IsPublic,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("updated_at")] DateTime UpdatedAt
);

public record TaskDto(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("project_id")] long ProjectId,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("priority")] string Priority,
    [property: JsonPropertyName("start_date")] DateTime? StartDate,
    [property: JsonPropertyName("due_date")] DateTime? DueDate,
    [property: JsonPropertyName("assigned_count")] int AssignedCount,
    [property: JsonPropertyName("comment_count")] int CommentCount,
    [property: JsonPropertyName("total_subtasks")] int TotalSubtasks,
    [property: JsonPropertyName("completed_subtasks")] int CompletedSubtasks,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("updated_at")] DateTime UpdatedAt,
    [property: JsonPropertyName("tags")] TaskTagDto[]? Tags
);

public record TaskTagDto(
    [property: JsonPropertyName("tag")] string Tag
);

public record ProjectWithTasksDto(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("client")] string? Client,
    [property: JsonPropertyName("budget")] decimal? Budget,
    [property: JsonPropertyName("due_date")] DateTime? DueDate,
    [property: JsonPropertyName("icon")] string? Icon,
    [property: JsonPropertyName("icon_color")] string? IconColor,
    [property: JsonPropertyName("is_public")] bool IsPublic,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("updated_at")] DateTime UpdatedAt,
    [property: JsonPropertyName("tasks")] TaskDto[]? Tasks
);

public record TaskCommentDto(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("task_id")] long TaskId,
    [property: JsonPropertyName("user_id")] Guid UserId,
    [property: JsonPropertyName("user_name")] string? UserName,
    [property: JsonPropertyName("content")] string Content,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt
);


