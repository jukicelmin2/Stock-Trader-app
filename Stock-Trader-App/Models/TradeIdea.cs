using Stock_Trader_App.Models.Enums;

namespace Stock_Trader_App.Models
{
    public class TradeIdea
    {
        public int Id { get; set; }

        public string Ticker { get; set; }

        public double StrikePrice { get; set; }
        public DateTime ExpirationDate { get; set; }
        public double? Delta { get; set; }
        public double Premium { get; set; }
        public double IV { get; set; }
        public int DTE { get; set; }
        public double ROI { get; set; }
        public string OptionType { get; set; } 

        public Strategy Strategy { get; set; }
        public string Notes { get; set; }
        public Status Status { get; set; } = Status.Idea;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
