using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Sominnercore.Models;
using Sominnercore.Options;

namespace Sominnercore.Services;

public class SupabaseProjectsService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseOptions _options;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    public SupabaseProjectsService(HttpClient httpClient, IOptions<SupabaseOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<ProjectDto[]> GetProjectsAsync(string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(HttpMethod.Get, $"{_options.Url!.TrimEnd('/')}/rest/v1/projects?select=*&order=created_at.desc");
        request.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to fetch projects: {response.StatusCode} - {content}");
        }

        var data = JsonSerializer.Deserialize<ProjectDto[]>(content, _serializerOptions);
        return data ?? Array.Empty<ProjectDto>();
    }

    public async Task<ProjectWithTasksDto?> GetProjectWithTasksAsync(long projectId, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        // First get the project
        var projectRequest = new HttpRequestMessage(HttpMethod.Get, $"{_options.Url!.TrimEnd('/')}/rest/v1/projects?id=eq.{projectId}&select=*");
        projectRequest.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            projectRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            projectRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var projectResponse = await _httpClient.SendAsync(projectRequest, cancellationToken);
        var projectContent = await projectResponse.Content.ReadAsStringAsync(cancellationToken);

        if (!projectResponse.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to fetch project: {projectResponse.StatusCode} - {projectContent}");
        }

        var projects = JsonSerializer.Deserialize<ProjectDto[]>(projectContent, _serializerOptions);
        if (projects == null || projects.Length == 0)
        {
            return null;
        }

        var project = projects[0];

        // Get tasks with tags
        var tasksRequest = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/tasks?project_id=eq.{projectId}&select=*,task_tags(tag)&order=created_at.asc"
        );
        tasksRequest.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            tasksRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            tasksRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var tasksResponse = await _httpClient.SendAsync(tasksRequest, cancellationToken);
        var tasksContent = await tasksResponse.Content.ReadAsStringAsync(cancellationToken);

        if (!tasksResponse.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to fetch tasks: {tasksResponse.StatusCode} - {tasksContent}");
        }

        // Parse tasks with nested tags
        var tasksData = JsonSerializer.Deserialize<JsonElement[]>(tasksContent, _serializerOptions) ?? Array.Empty<JsonElement>();
        var tasks = tasksData.Select(taskElement =>
        {
            // Extract tags from nested structure
            var tags = new List<string>();
            if (taskElement.TryGetProperty("task_tags", out var tagsElement) && tagsElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var tagElement in tagsElement.EnumerateArray())
                {
                    if (tagElement.TryGetProperty("tag", out var tagValue))
                    {
                        var tagStr = tagValue.GetString();
                        if (!string.IsNullOrEmpty(tagStr))
                        {
                            tags.Add(tagStr);
                        }
                    }
                }
            }

            // Manually extract task properties to avoid deserialization issues with nested task_tags
            var id = taskElement.TryGetProperty("id", out var idProp) ? idProp.GetInt64() : 0;
            var projectId = taskElement.TryGetProperty("project_id", out var projectIdProp) ? projectIdProp.GetInt64() : 0;
            var title = taskElement.TryGetProperty("title", out var titleProp) ? titleProp.GetString() ?? string.Empty : string.Empty;
            var description = taskElement.TryGetProperty("description", out var descProp) && descProp.ValueKind != JsonValueKind.Null ? descProp.GetString() : null;
            var status = taskElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() ?? "To Do" : "To Do";
            var priority = taskElement.TryGetProperty("priority", out var priorityProp) ? priorityProp.GetString() ?? "medium" : "medium";
            var startDate = taskElement.TryGetProperty("start_date", out var startDateProp) && startDateProp.ValueKind != JsonValueKind.Null
                ? startDateProp.GetDateTime() : (DateTime?)null;
            var dueDate = taskElement.TryGetProperty("due_date", out var dueDateProp) && dueDateProp.ValueKind != JsonValueKind.Null
                ? dueDateProp.GetDateTime() : (DateTime?)null;
            var assignedCount = taskElement.TryGetProperty("assigned_count", out var assignedCountProp) ? assignedCountProp.GetInt32() : 0;
            var commentCount = taskElement.TryGetProperty("comment_count", out var commentCountProp) ? commentCountProp.GetInt32() : 0;
            var totalSubtasks = taskElement.TryGetProperty("total_subtasks", out var totalSubtasksProp) ? totalSubtasksProp.GetInt32() : 0;
            var completedSubtasks = taskElement.TryGetProperty("completed_subtasks", out var completedSubtasksProp) ? completedSubtasksProp.GetInt32() : 0;
            var createdAt = taskElement.TryGetProperty("created_at", out var createdAtProp) ? createdAtProp.GetDateTime() : DateTime.UtcNow;
            var updatedAt = taskElement.TryGetProperty("updated_at", out var updatedAtProp) ? updatedAtProp.GetDateTime() : DateTime.UtcNow;

            return new TaskDto(
                id,
                projectId,
                title,
                description,
                status,
                priority,
                startDate,
                dueDate,
                assignedCount,
                commentCount,
                totalSubtasks,
                completedSubtasks,
                createdAt,
                updatedAt,
                tags.Select(t => new TaskTagDto(t)).ToArray()
            );
        }).ToArray();

        return new ProjectWithTasksDto(
            project.Id,
            project.Name,
            project.Description,
            project.Client,
            project.Budget,
            project.DueDate,
            project.Icon,
            project.IconColor,
            project.IsPublic,
            project.CreatedAt,
            project.UpdatedAt,
            tasks
        );
    }

    public async Task<ProjectWithTasksDto[]> GetAllProjectsWithTasksAsync(string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        // Get all projects
        var projects = await GetProjectsAsync(accessToken, cancellationToken);

        // Get tasks for each project
        var projectsWithTasks = new List<ProjectWithTasksDto>();

        foreach (var project in projects)
        {
            var projectWithTasks = await GetProjectWithTasksAsync(project.Id, accessToken, cancellationToken);
            if (projectWithTasks != null)
            {
                projectsWithTasks.Add(projectWithTasks);
            }
        }

        return projectsWithTasks.ToArray();
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var projectData = new
        {
            name = request.Name,
            description = request.Description,
            client = request.Client,
            budget = request.Budget,
            due_date = request.EndDate?.ToString("yyyy-MM-dd"),
            icon = request.Icon,
            icon_color = request.ColorTheme,
            is_public = request.IsPublic
        };

        var json = JsonSerializer.Serialize(projectData, _serializerOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url!.TrimEnd('/')}/rest/v1/projects");
        requestMessage.Content = content;
        requestMessage.Headers.Add("apikey", _options.AnonKey);
        requestMessage.Headers.Add("Prefer", "return=representation");

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to create project: {response.StatusCode} - {responseContent}");
        }

        var projects = JsonSerializer.Deserialize<ProjectDto[]>(responseContent, _serializerOptions);
        if (projects == null || projects.Length == 0)
        {
            throw new InvalidOperationException("Failed to create project: No data returned");
        }

        return projects[0];
    }

    public async Task<bool> DeleteProjectAsync(long projectId, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var requestMessage = new HttpRequestMessage(HttpMethod.Delete, $"{_options.Url!.TrimEnd('/')}/rest/v1/projects?id=eq.{projectId}");
        requestMessage.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to delete project: {response.StatusCode} - {content}");
        }

        return true;
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var taskData = new
        {
            project_id = request.ProjectId,
            title = request.Title,
            description = request.Description,
            status = request.Status ?? "To Do",
            priority = request.Priority ?? "medium",
            start_date = request.StartDate?.ToString("yyyy-MM-dd"),
            due_date = request.DueDate?.ToString("yyyy-MM-dd")
        };

        var json = JsonSerializer.Serialize(taskData, _serializerOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url!.TrimEnd('/')}/rest/v1/tasks");
        requestMessage.Content = content;
        requestMessage.Headers.Add("apikey", _options.AnonKey);
        requestMessage.Headers.Add("Prefer", "return=representation");

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to create task: {response.StatusCode} - {responseContent}");
        }

        var tasks = JsonSerializer.Deserialize<TaskDto[]>(responseContent, _serializerOptions);
        if (tasks == null || tasks.Length == 0)
        {
            throw new InvalidOperationException("Failed to create task: No data returned");
        }

        return tasks[0];
    }

    public async Task<TaskDto?> GetTaskByIdAsync(long taskId, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var requestMessage = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/tasks?id=eq.{taskId}&select=*,task_tags(tag)"
        );
        requestMessage.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to fetch task: {response.StatusCode} - {content}");
        }

        var tasksData = JsonSerializer.Deserialize<JsonElement[]>(content, _serializerOptions) ?? Array.Empty<JsonElement>();
        if (tasksData.Length == 0)
        {
            return null;
        }

        var taskElement = tasksData[0];

        // Extract tags from nested structure
        var tags = new List<string>();
        if (taskElement.TryGetProperty("task_tags", out var tagsElement) && tagsElement.ValueKind == JsonValueKind.Array)
        {
            foreach (var tagElement in tagsElement.EnumerateArray())
            {
                if (tagElement.TryGetProperty("tag", out var tagValue))
                {
                    var tagStr = tagValue.GetString();
                    if (!string.IsNullOrEmpty(tagStr))
                    {
                        tags.Add(tagStr);
                    }
                }
            }
        }

        // Manually extract task properties
        var id = taskElement.TryGetProperty("id", out var idProp) ? idProp.GetInt64() : 0;
        var projectId = taskElement.TryGetProperty("project_id", out var projectIdProp) ? projectIdProp.GetInt64() : 0;
        var title = taskElement.TryGetProperty("title", out var titleProp) ? titleProp.GetString() ?? string.Empty : string.Empty;
        var description = taskElement.TryGetProperty("description", out var descProp) && descProp.ValueKind != JsonValueKind.Null ? descProp.GetString() : null;
        var status = taskElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() ?? "To Do" : "To Do";
        var priority = taskElement.TryGetProperty("priority", out var priorityProp) ? priorityProp.GetString() ?? "medium" : "medium";
        var startDate = taskElement.TryGetProperty("start_date", out var startDateProp) && startDateProp.ValueKind != JsonValueKind.Null
            ? startDateProp.GetDateTime() : (DateTime?)null;
        var dueDate = taskElement.TryGetProperty("due_date", out var dueDateProp) && dueDateProp.ValueKind != JsonValueKind.Null
            ? dueDateProp.GetDateTime() : (DateTime?)null;
        var assignedCount = taskElement.TryGetProperty("assigned_count", out var assignedCountProp) ? assignedCountProp.GetInt32() : 0;
        var commentCount = taskElement.TryGetProperty("comment_count", out var commentCountProp) ? commentCountProp.GetInt32() : 0;
        var totalSubtasks = taskElement.TryGetProperty("total_subtasks", out var totalSubtasksProp) ? totalSubtasksProp.GetInt32() : 0;
        var completedSubtasks = taskElement.TryGetProperty("completed_subtasks", out var completedSubtasksProp) ? completedSubtasksProp.GetInt32() : 0;
        var createdAt = taskElement.TryGetProperty("created_at", out var createdAtProp) ? createdAtProp.GetDateTime() : DateTime.UtcNow;
        var updatedAt = taskElement.TryGetProperty("updated_at", out var updatedAtProp) ? updatedAtProp.GetDateTime() : DateTime.UtcNow;

        return new TaskDto(
            id,
            projectId,
            title,
            description,
            status,
            priority,
            startDate,
            dueDate,
            assignedCount,
            commentCount,
            totalSubtasks,
            completedSubtasks,
            createdAt,
            updatedAt,
            tags.Select(t => new TaskTagDto(t)).ToArray()
        );
    }

    public async Task<TaskDto> UpdateTaskAsync(long taskId, UpdateTaskRequest request, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var taskData = new
        {
            title = request.Title,
            description = request.Description,
            status = request.Status,
            priority = request.Priority,
            start_date = request.StartDate?.ToString("yyyy-MM-dd"),
            due_date = request.DueDate?.ToString("yyyy-MM-dd")
        };

        var json = JsonSerializer.Serialize(taskData, _serializerOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var requestMessage = new HttpRequestMessage(HttpMethod.Patch, $"{_options.Url!.TrimEnd('/')}/rest/v1/tasks?id=eq.{taskId}");
        requestMessage.Content = content;
        requestMessage.Headers.Add("apikey", _options.AnonKey);
        requestMessage.Headers.Add("Prefer", "return=representation");

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to update task: {response.StatusCode} - {responseContent}");
        }

        var tasks = JsonSerializer.Deserialize<TaskDto[]>(responseContent, _serializerOptions);
        if (tasks == null || tasks.Length == 0)
        {
            throw new InvalidOperationException("Failed to update task: No data returned");
        }

        return tasks[0];
    }

    public async Task<bool> DeleteTaskAsync(long taskId, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var requestMessage = new HttpRequestMessage(HttpMethod.Delete, $"{_options.Url!.TrimEnd('/')}/rest/v1/tasks?id=eq.{taskId}");
        requestMessage.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to delete task: {response.StatusCode} - {content}");
        }

        return true;
    }

    // Comments methods
    public async Task<TaskCommentDto[]> GetTaskCommentsAsync(long taskId, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/task_comments?task_id=eq.{taskId}&select=id,task_id,user_id,content,created_at,team_members!task_comments_user_id_fkey(display_name)&order=created_at.asc");
        request.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to fetch task comments: {response.StatusCode} - {content}");
        }

        try
        {
            var jsonDoc = JsonDocument.Parse(content);
            var comments = new List<TaskCommentDto>();

            foreach (var commentElement in jsonDoc.RootElement.EnumerateArray())
            {
                var id = commentElement.TryGetProperty("id", out var idProp) ? idProp.GetInt64() : 0;
                var taskIdVal = commentElement.TryGetProperty("task_id", out var taskIdProp) ? taskIdProp.GetInt64() : 0;
                var userId = commentElement.TryGetProperty("user_id", out var userIdProp) && userIdProp.ValueKind == JsonValueKind.String
                    ? Guid.Parse(userIdProp.GetString()!) : Guid.Empty;
                var contentText = commentElement.TryGetProperty("content", out var contentProp) ? contentProp.GetString() ?? string.Empty : string.Empty;
                var createdAt = commentElement.TryGetProperty("created_at", out var createdAtProp) ? createdAtProp.GetDateTime() : DateTime.UtcNow;

                // Try to get user name from team_members relation
                string? userName = null;
                if (commentElement.TryGetProperty("team_members", out var teamMembersProp))
                {
                    if (teamMembersProp.ValueKind == JsonValueKind.Object)
                    {
                        userName = teamMembersProp.TryGetProperty("display_name", out var nameProp) ? nameProp.GetString() : null;
                    }
                    else if (teamMembersProp.ValueKind == JsonValueKind.Array && teamMembersProp.GetArrayLength() > 0)
                    {
                        var firstMember = teamMembersProp[0];
                        userName = firstMember.TryGetProperty("display_name", out var nameProp) ? nameProp.GetString() : null;
                    }
                }

                // Fallback: if no display_name found, use user_id as string
                if (string.IsNullOrWhiteSpace(userName))
                {
                    userName = $"User {userId.ToString()[..8]}";
                }

                comments.Add(new TaskCommentDto(id, taskIdVal, userId, userName, contentText, createdAt));
            }

            return comments.ToArray();
        }
        catch (JsonException ex)
        {
            throw new HttpRequestException($"Failed to parse task comments response: {ex.Message}", ex);
        }
    }

    public async Task<TaskCommentDto> CreateTaskCommentAsync(long taskId, string content, Guid userId, string? accessToken = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var commentData = new
        {
            task_id = taskId,
            user_id = userId,
            content = content
        };

        var jsonContent = JsonSerializer.Serialize(commentData);
        var requestContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url!.TrimEnd('/')}/rest/v1/task_comments");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Add("Prefer", "return=representation");
        request.Content = requestContent;

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }
        else
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        }

        var response = await _httpClient.SendAsync(request, cancellationToken);
        var contentStr = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to create task comment: {response.StatusCode} - {contentStr}");
        }

        try
        {
            var jsonDoc = JsonDocument.Parse(contentStr);
            var commentElement = jsonDoc.RootElement.EnumerateArray().FirstOrDefault();

            var id = commentElement.TryGetProperty("id", out var idProp) ? idProp.GetInt64() : 0;
            var taskIdVal = commentElement.TryGetProperty("task_id", out var taskIdProp) ? taskIdProp.GetInt64() : 0;
            var userIdVal = commentElement.TryGetProperty("user_id", out var userIdProp) && userIdProp.ValueKind == JsonValueKind.String
                ? Guid.Parse(userIdProp.GetString()!) : Guid.Empty;
            var contentText = commentElement.TryGetProperty("content", out var contentProp) ? contentProp.GetString() ?? string.Empty : string.Empty;
            var createdAt = commentElement.TryGetProperty("created_at", out var createdAtProp) ? createdAtProp.GetDateTime() : DateTime.UtcNow;

            // Note: The created comment response won't include the joined team_members data
            // We'll rely on reloading the comments list to get the full data with user names
            // Return with a placeholder user name that will be replaced when comments are reloaded
            var userName = $"User {userIdVal.ToString()[..8]}";

            return new TaskCommentDto(id, taskIdVal, userIdVal, userName, contentText, createdAt);
        }
        catch (JsonException ex)
        {
            throw new HttpRequestException($"Failed to parse create comment response: {ex.Message}", ex);
        }
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.Url) || string.IsNullOrWhiteSpace(_options.AnonKey) ||
            _options.Url.Contains("your-project-ref", StringComparison.OrdinalIgnoreCase) ||
            _options.AnonKey.Contains("your-anon-key", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Supabase configuration is missing or still using placeholder values.");
        }
    }
}

public class CreateProjectRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Client { get; set; }
    public decimal? Budget { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Icon { get; set; }
    public string? ColorTheme { get; set; }
    public bool IsPublic { get; set; }
}

public class CreateTaskRequest
{
    public long ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
}

public class UpdateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
}

