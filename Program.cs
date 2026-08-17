using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using KobNeti;
using KobNeti.Services;
using Supabase;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Configure Supabase
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? "";
var supabaseKey = builder.Configuration["Supabase:AnonKey"] ?? "";
// Must match a schema listed under Project Settings → API → Exposed schemas
var supabaseSchema = builder.Configuration["Supabase:Schema"] ?? "public";

builder.Services.AddScoped<LocalStorageSessionHandler>();
builder.Services.AddScoped<AuthSessionStore>();
builder.Services.AddScoped(sp =>
{
    var options = new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = false,
        Schema = supabaseSchema,
        SessionHandler = sp.GetRequiredService<LocalStorageSessionHandler>()
    };
    return new Supabase.Client(supabaseUrl, supabaseKey, options);
});

builder.Services.AddSingleton<ProductChangeNotifier>();
builder.Services.AddScoped<RateLimiter>();
builder.Services.AddScoped<SupabaseAuthService>();
builder.Services.AddScoped<SoftwareProductService>();
builder.Services.AddScoped<PageContentService>();

var supportApiBase = builder.Configuration["KobNetiApi:BaseUrl"] ?? "http://localhost:5241/";
builder.Services.AddScoped<KobNeti.Services.Support.SupportApiClient>(sp =>
{
    var auth = sp.GetRequiredService<SupabaseAuthService>();
    var http = new HttpClient { BaseAddress = new Uri(supportApiBase) };
    return new KobNeti.Services.Support.SupportApiClient(http, builder.Configuration, auth);
});

await builder.Build().RunAsync();
