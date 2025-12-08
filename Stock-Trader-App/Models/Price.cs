namespace Stock_Trader_App.Models
{
    public class Price
    {
        public int Id { get; set; }
        public double Value { get; set; }
        public double? AbsoluteChange { get; set; }
        public double? RelativeChange { get; set; }
        public DateTime Date { get; set; }
    }
}
