using Stock_Trader_App.Models.Enums;

namespace Stock_Trader_App.Models
{
    public class Option
    {
        public int Id { get; set; }

        public int StockId { get; set; }
        public Stock Stock { get; set; }

        public string ContractName { get; set; }
        public DateTime ExpirationDate { get; set; }
        public double StrikePrice { get; set; }
        public double PremiumPrice { get; set; }
        public double IV { get; set; }
        public double? Delta { get; set; }
        public OptionType Type { get; set; }
    }
}
