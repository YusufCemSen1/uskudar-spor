namespace backend.Middleware;

public class SecurityHeadersMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        var h = ctx.Response.Headers;

        // XSS koruması
        h["X-Content-Type-Options"]    = "nosniff";
        h["X-Frame-Options"]           = "DENY";
        h["X-XSS-Protection"]          = "1; mode=block";
        h["Referrer-Policy"]           = "strict-origin-when-cross-origin";

        // HSTS (production'da etkinleştir)
        // h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";

        // İçerik Güvenlik Politikası
        h["Content-Security-Policy"] =
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +  // React inline script gerektirir
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: blob: https:; " +
            "connect-src 'self' https://sandbox-api.iyzipay.com https://api.iyzipay.com; " +
            "frame-src https://sandbox-api.iyzipay.com https://api.iyzipay.com; " +
            "object-src 'none'; " +
            "base-uri 'self';";

        // Hassas bilgileri gizle
        h["Server"]           = "";
        h["X-Powered-By"]     = "";
        h["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";

        await next(ctx);
    }
}

public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
        => app.UseMiddleware<SecurityHeadersMiddleware>();
}
