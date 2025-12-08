namespace Stock_Trader_App.Models
{
    public class Stock
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Ticker { get; set; }

        public Price AtClosePrice { get; set; }
        public Price PreMarketPrice { get; set; }

        public List<HistoricalPrice> HistoricalData { get; set; } = new();
        public List<Option> Options { get; set; } = new();
    }
}
