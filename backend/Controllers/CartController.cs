using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    // In-memory cart store: userId -> cart JSON
    private static readonly ConcurrentDictionary<string, string> _carts = new();

    [HttpGet("{userId}")]
    public IActionResult GetCart(string userId)
    {
        if (_carts.TryGetValue(userId, out var cart))
            return Content(cart, "application/json");
        return Ok(new { items = Array.Empty<object>() });
    }

    [HttpPost("{userId}")]
    public IActionResult SaveCart(string userId, [FromBody] JsonElement body)
    {
        _carts[userId] = body.GetRawText();
        return Ok(new { success = true });
    }

    [HttpDelete("{userId}")]
    public IActionResult ClearCart(string userId)
    {
        _carts.TryRemove(userId, out _);
        return Ok(new { success = true });
    }
}
