using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SominnercoreNew;
using SominnercoreNew.Services;
using Supabase;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Configure Supabase
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? "";
var supabaseKey = builder.Configuration["Supabase:AnonKey"] ?? "";

builder.Services.AddScoped(sp =>
{
    var options = new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = false,
        Schema = "sominnercore"
    };
    return new Supabase.Client(supabaseUrl, supabaseKey, options);
});

builder.Services.AddSingleton<ProductChangeNotifier>();
builder.Services.AddSingleton<RateLimiter>();
builder.Services.AddScoped<SupabaseAuthService>();
builder.Services.AddScoped<SoftwareProductService>();

await builder.Build().RunAsync();
