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
            var status = taskElement.TryGetProperty("status", out var statusProp) ? statusProp.GetString() ?? "To Do" : "To Do";
            var priority = taskElement.TryGetProperty("priority", out var priorityProp) ? priorityProp.GetString() ?? "medium" : "medium";
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
                status,
                priority,
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

