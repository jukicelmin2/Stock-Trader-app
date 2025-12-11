using Stock_Trader_App.Models.Enums;

public class OptionFilterRequest
{
    public string Ticker { get; set; }

    public OptionType? Type { get; set; }  // CALL, PUT, or null (both)

    public double? MinDelta { get; set; }
    public double? MaxDelta { get; set; }

    public double? MinPremium { get; set; }

    public int? MinDTE { get; set; }
    public int? MaxDTE { get; set; }
}
