using Stock_Trader_App.Models.Enums;

namespace Stock_Trader_App.Models
{
    public class TradeIdea
    {
        public int Id { get; set; }

        public int OptionId { get; set; }
        public Option Option { get; set; }

        public Strategy Strategy { get; set; }
        public Status Status { get; set; }
        public string Note { get; set; }

        public string UserId { get; set; }
    }
}
