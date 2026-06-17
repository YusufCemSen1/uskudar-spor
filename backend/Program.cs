using AspNetCoreRateLimit;
using backend.Middleware;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Servisler ────────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// Iyzico
builder.Services.Configure<IyzicoOptions>(builder.Configuration.GetSection("Iyzico"));
builder.Services.AddScoped<IyzicoService>();

// CORS — sadece izin verilen originlerden istek kabul et
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(o => o.AddPolicy("Frontend", p =>
    p.WithOrigins(allowedOrigins)
     .AllowAnyMethod()
     .AllowAnyHeader()
     .AllowCredentials()));

// Rate Limiting (IP başına)
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddInMemoryRateLimiting();

// Sağlık kontrolü
builder.Services.AddHealthChecks();

var app = builder.Build();

// ── Middleware sırası önemli ─────────────────────────────────────────────────
app.UseSecurityHeaders();        // Güvenlik başlıkları (en önce)
app.UseIpRateLimiting();         // Rate limiting
app.UseHttpsRedirection();       // HTTP → HTTPS yönlendirmesi
app.UseCors("Frontend");         // CORS
app.UseInputSanitization();      // XSS temizliği
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
