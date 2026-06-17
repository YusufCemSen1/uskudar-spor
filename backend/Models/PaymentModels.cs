namespace backend.Models;

public class CartItem
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string? Category { get; set; }
}

public class InitPaymentRequest
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string IdentityNumber { get; set; } = ""; // TC Kimlik (sandbox: 74300864791)
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string Country { get; set; } = "Turkey";
    public string CardHolderName { get; set; } = "";
    public string CardNumber { get; set; } = "";
    public string ExpireMonth { get; set; } = "";
    public string ExpireYear { get; set; } = "";
    public string Cvc { get; set; } = "";
    public string? ConversationId { get; set; }
    public List<CartItem> Items { get; set; } = [];
    public string CallbackUrl { get; set; } = "";
}

public class CheckPaymentRequest
{
    public string PaymentId { get; set; } = "";
    public string ConversationId { get; set; } = "";
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string? Status { get; set; }
    public string? PaymentId { get; set; }
    public string? ConversationId { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorMessage { get; set; }
    public decimal? PaidPrice { get; set; }
    public string? HtmlContent { get; set; } // 3DS için
}
