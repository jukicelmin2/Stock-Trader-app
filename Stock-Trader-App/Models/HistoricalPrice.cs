using System;
namespace Stock_Trader_App.Models

{
    public class HistoricalPrice
    {
        public int Id { get; set; }
        public double AtOpen { get; set; }
        public double AtClose { get; set; }
        public DateTime Date { get; set; }

        public int StockId { get; set; }
        public Stock Stock { get; set; }
    }
}
