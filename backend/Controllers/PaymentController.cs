using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController(IyzicoService iyzico, ILogger<PaymentController> logger) : ControllerBase
{
    // POST /api/payment/initialize
    // Ödeme formunu başlatır, 3DS HTML içeriği döner
    [HttpPost("initialize")]
    public async Task<IActionResult> Initialize([FromBody] InitPaymentRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { error = "Eksik ya da hatalı bilgi" });

        if (req.Items.Count == 0)
            return BadRequest(new { error = "Sepet boş" });

        // Kart numarasını loglamıyoruz
        logger.LogInformation("Ödeme başlatıldı: {Email}, Tutar={Total:F2} TRY",
            req.Email, req.Items.Sum(i => i.Price * i.Quantity));

        req.CallbackUrl = $"{Request.Scheme}://{Request.Host}/api/payment/callback";

        var result = await iyzico.Initialize3DSAsync(req);

        if (!result.Success)
            return BadRequest(new { error = result.ErrorMessage ?? "Ödeme başlatılamadı", code = result.ErrorCode });

        // 3DS HTML içeriğini döndür — frontend iframe/redirect ile gösterecek
        return Ok(new
        {
            conversationId = result.ConversationId,
            htmlContent    = result.HtmlContent,
        });
    }

    // POST /api/payment/callback  (iyzico banka 3DS'ten döner)
    [HttpPost("callback")]
    [Consumes("application/x-www-form-urlencoded")]
    public async Task<IActionResult> Callback([FromForm] IFormCollection form)
    {
        var status           = form["status"].ToString();
        var paymentId        = form["paymentId"].ToString();
        var conversationId   = form["conversationId"].ToString();
        var conversationData = form["conversationData"].ToString();

        if (status != "success")
        {
            logger.LogWarning("3DS callback başarısız: {Status}", status);
            return Redirect("/odeme?status=failed");
        }

        var result = await iyzico.Complete3DSAsync(paymentId, conversationId, conversationData);

        if (result.Success)
        {
            logger.LogInformation("Ödeme tamamlandı: PaymentId={PayId}", result.PaymentId);
            return Redirect($"/odeme?status=success&paymentId={result.PaymentId}");
        }

        logger.LogWarning("3DS complete başarısız: {Error}", result.ErrorMessage);
        return Redirect($"/odeme?status=failed&error={Uri.EscapeDataString(result.ErrorMessage ?? "")}");
    }

    // GET /api/payment/health
    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "ok", time = DateTime.UtcNow });
}
