using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using backend.Models;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class IyzicoOptions
{
    public string ApiKey { get; set; } = "";
    public string SecretKey { get; set; } = "";
    public string BaseUrl { get; set; } = "https://sandbox-api.iyzipay.com";
}

public class IyzicoService
{
    private readonly Iyzipay.Options _options;
    private readonly ILogger<IyzicoService> _logger;

    public IyzicoService(IOptions<IyzicoOptions> opts, ILogger<IyzicoService> logger)
    {
        _logger = logger;
        _options = new Iyzipay.Options
        {
            ApiKey    = opts.Value.ApiKey,
            SecretKey = opts.Value.SecretKey,
            BaseUrl   = opts.Value.BaseUrl,
        };
    }

    // ── 3D Secure ödeme başlat ────────────────────────────────────────────────
    public async Task<PaymentResult> Initialize3DSAsync(InitPaymentRequest req)
    {
        var conversationId = req.ConversationId ?? Guid.NewGuid().ToString("N")[..16];
        var total = req.Items.Sum(i => i.Price * i.Quantity);

        var request = new CreatePaymentRequest
        {
            Locale          = Locale.TR.ToString(),
            ConversationId  = conversationId,
            Price           = total.ToString("F2", System.Globalization.CultureInfo.InvariantCulture),
            PaidPrice       = total.ToString("F2", System.Globalization.CultureInfo.InvariantCulture),
            Currency        = Currency.TRY.ToString(),
            Installment     = 1,
            BasketId        = $"BASKET-{conversationId}",
            PaymentChannel  = PaymentChannel.WEB.ToString(),
            PaymentGroup    = PaymentGroup.PRODUCT.ToString(),
            CallbackUrl     = req.CallbackUrl,
            PaymentCard     = new PaymentCard
            {
                CardHolderName = req.CardHolderName,
                CardNumber     = req.CardNumber,
                ExpireMonth    = req.ExpireMonth,
                ExpireYear     = req.ExpireYear,
                Cvc            = req.Cvc,
                RegisterCard   = 0,
            },
            Buyer = new Buyer
            {
                Id                  = $"USK-{Guid.NewGuid():N}"[..16],
                Name                = req.FirstName,
                Surname             = req.LastName,
                GsmNumber           = req.Phone,
                Email               = req.Email,
                IdentityNumber      = req.IdentityNumber,
                RegistrationAddress = req.Address,
                City                = req.City,
                Country             = req.Country,
                Ip                  = "85.34.78.112", // gerçek uygulamada HttpContext'ten al
            },
            ShippingAddress = new Address
            {
                ContactName = $"{req.FirstName} {req.LastName}",
                City        = req.City,
                Country     = req.Country,
                Description = req.Address,
            },
            BillingAddress = new Address
            {
                ContactName = $"{req.FirstName} {req.LastName}",
                City        = req.City,
                Country     = req.Country,
                Description = req.Address,
            },
            BasketItems = req.Items.Select(item => new BasketItem
            {
                Id        = item.Id,
                Name      = item.Name,
                Category1 = item.Category ?? "Genel",
                ItemType  = BasketItemType.PHYSICAL.ToString(),
                Price     = (item.Price * item.Quantity).ToString("F2", System.Globalization.CultureInfo.InvariantCulture),
            }).ToList(),
        };

        try
        {
            var result = await Task.Run(() => ThreedsInitialize.Create(request, _options));
            _logger.LogInformation("Iyzico 3DS init: {Status} ConvId={ConvId}", result.Status, conversationId);

            if (result.Status == "success")
                return new PaymentResult
                {
                    Success        = true,
                    Status         = result.Status,
                    ConversationId = conversationId,
                    HtmlContent    = result.HtmlContent, // banka 3DS sayfası
                };

            return new PaymentResult
            {
                Success       = false,
                Status        = result.Status,
                ErrorCode     = result.ErrorCode,
                ErrorMessage  = result.ErrorMessage,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Iyzico 3DS initialize hatası");
            return new PaymentResult { Success = false, ErrorMessage = "Ödeme sistemi bağlantı hatası" };
        }
    }

    // ── 3D Secure callback — ödemeyi tamamla ─────────────────────────────────
    public async Task<PaymentResult> Complete3DSAsync(string paymentId, string conversationId, string conversationData)
    {
        var request = new CreateThreedsPaymentRequest
        {
            Locale           = Locale.TR.ToString(),
            ConversationId   = conversationId,
            PaymentId        = paymentId,
            ConversationData = conversationData,
        };

        try
        {
            var result = await Task.Run(() => ThreedsPayment.Create(request, _options));
            _logger.LogInformation("Iyzico 3DS complete: {Status} PayId={PayId}", result.Status, result.PaymentId);

            return new PaymentResult
            {
                Success        = result.Status == "success",
                Status         = result.Status,
                PaymentId      = result.PaymentId,
                ConversationId = conversationId,
                PaidPrice      = decimal.TryParse(result.PaidPrice, out var p) ? p : null,
                ErrorCode      = result.ErrorCode,
                ErrorMessage   = result.ErrorMessage,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Iyzico 3DS complete hatası");
            return new PaymentResult { Success = false, ErrorMessage = "Ödeme tamamlama hatası" };
        }
    }
}
