using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Sominnercore;
using Sominnercore.Services;
using Sominnercore.Options;
using MudBlazor.Services;
using Microsoft.AspNetCore.Components.Authorization;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");
builder.Services.AddMudServices();

var supabaseOptions = new SupabaseOptions();
builder.Configuration.GetSection("Supabase").Bind(supabaseOptions);
builder.Services.AddSingleton(Options.Create(supabaseOptions));

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<SupabaseAuthService>();
builder.Services.AddScoped<SupabaseChatService>();

await builder.Build().RunAsync();
