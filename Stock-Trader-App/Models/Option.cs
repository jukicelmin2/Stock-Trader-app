using Stock_Trader_App.Models.Enums;

public class Option
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Ticker { get; set; }
    public string ContractName { get; set; }
    public DateTime ExpirationDate { get; set; }
    public double StrikePrice { get; set; }
    public double PremiumPrice { get; set; }
    public double IV { get; set; }
    public double? Delta { get; set; }
    public OptionType Type { get; set; }
    public int DTE { get; set; }
    public double ROI { get; set; }
}
