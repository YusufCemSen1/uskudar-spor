using System.Text;
using System.Text.RegularExpressions;

namespace backend.Middleware;

// JSON body'den tehlikeli script/html taglarını temizler
public class InputSanitizationMiddleware(RequestDelegate next)
{
    private static readonly Regex ScriptTag = new(
        @"<script[\s\S]*?>[\s\S]*?</script>|javascript:|on\w+\s*=",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public async Task InvokeAsync(HttpContext ctx)
    {
        if (ctx.Request.ContentType?.Contains("application/json") == true &&
            (ctx.Request.Method == "POST" || ctx.Request.Method == "PUT"))
        {
            ctx.Request.EnableBuffering();
            using var reader = new StreamReader(ctx.Request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            ctx.Request.Body.Position = 0;

            if (ScriptTag.IsMatch(body))
            {
                ctx.Response.StatusCode = 400;
                await ctx.Response.WriteAsJsonAsync(new { error = "Geçersiz içerik" });
                return;
            }
        }

        await next(ctx);
    }
}

public static class InputSanitizationExtensions
{
    public static IApplicationBuilder UseInputSanitization(this IApplicationBuilder app)
        => app.UseMiddleware<InputSanitizationMiddleware>();
}
