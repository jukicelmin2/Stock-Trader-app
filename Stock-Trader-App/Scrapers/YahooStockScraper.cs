using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using Stock_Trader_App.Models;
using Stock_Trader_App.Models.Enums;
using System.Net.Http;
using System.Threading.Tasks;
namespace StockTrader.Api.Scrapers
{
    public class YahooStockScraper
    {
        

        private readonly HttpClient _httpClient;

        public YahooStockScraper(HttpClient httpClient)
        {
            _httpClient = httpClient;
            
        }


        public async Task<string> GetRawHtmlAsync(string ticker)
        {
            string url = $"https://finance.yahoo.com/quote/{ticker}/";
            string html = await _httpClient.GetStringAsync(url);
            return html;
        }

        public async Task<Stock> GetStockAsync(string ticker)
        {
            try { 
            var url = $"https://finance.yahoo.com/quote/{ticker}/";

            string html = await _httpClient.GetStringAsync(url);

            // 2) Ustvariš HTML dokument
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var nameNode = doc.DocumentNode.SelectSingleNode("//h1");
            string name = nameNode?.InnerText?.Trim() ?? ticker;

            // Najdemo price
            var closePriceNode = doc.DocumentNode.SelectSingleNode("//span[@data-testid='qsp-price']");
            var absoluteChangeCloseNode = doc.DocumentNode.SelectSingleNode("//span[@data-testid='qsp-price-change']");
            var relativeChangeCloseNode = doc.DocumentNode.SelectSingleNode("//span[@data-testid='qsp-price-change-percent']");
            var absoluteChangePreNode = doc.DocumentNode.SelectSingleNode("//span[@data-testid='qsp-pre-price-change']");
            var relativeChangePreNode = doc.DocumentNode.SelectSingleNode("//span[@data-testid='qsp-pre-price-change-percent']");
            var preMarketPriceNode = doc.DocumentNode.SelectSingleNode("//span[@data-testid='qsp-pre-price']");


            double relativeChangeClose = TryParseDouble(relativeChangeCloseNode?.InnerText);
            double absoluteChangeClose = TryParseDouble(absoluteChangeCloseNode?.InnerText);
            double closePrice = TryParseDouble(closePriceNode?.InnerText);
            double preMarketPrice = TryParseDouble(preMarketPriceNode?.InnerText);
            double absoluteChangePre = TryParseDouble(absoluteChangePreNode?.InnerText);
            double relativeChangePre = TryParseDouble(relativeChangePreNode?.InnerText);



            var stock = new Stock
            {
                Id = Guid.NewGuid().ToString(),
                Name = name,
                Ticker = ticker,
                AtClosePrice = new Price
                {
                    Value = closePrice,
                    AbsoluteChange = absoluteChangeClose,
                    RelativeChange = relativeChangeClose,
                    Date = DateTime.Now,
                },
                PreMarketPrice = new Price
                {
                    Value = preMarketPrice,
                    AbsoluteChange = absoluteChangePre,
                    RelativeChange = relativeChangePre,
                    Date = DateTime.Now,

                }
            };


            stock.HistoricalData = await GetHistoricalPricesAsync(ticker);

            return stock; }
            catch
    {
                return null;
            }

        }

        public List<HistoricalPrice> HistoricalData { get; set; }

        public async Task<List<HistoricalPrice>> GetHistoricalPricesAsync(string ticker)
        {
            var url = $"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=1y";

            var json = await _httpClient.GetStringAsync(url);

            JObject root = JObject.Parse(json);

            var result = root["chart"]?["result"]?[0];
            var timestamps = result?["timestamp"];
            var indicators = result?["indicators"]?["quote"]?[0];

            var list = new List<HistoricalPrice>();

            if (timestamps == null || indicators == null)
                return list;

            var opens = indicators["open"];
            var closes = indicators["close"];

            for (int i = 0; i < timestamps.Count(); i++)
            {
                long unix = timestamps[i]!.Value<long>();
                DateTime date = DateTimeOffset.FromUnixTimeSeconds(unix).DateTime;

                double open = opens[i]?.Value<double>() ?? 0;
                double close = closes[i]?.Value<double>() ?? 0;

                list.Add(new HistoricalPrice
                {
                    Date = date,
                    AtOpen = open,
                    AtClose = close
                });
            }

            return list;
        }

       



        private double TryParseDouble(string? input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return 0;

            input = input.Trim();

            // Replace unicode minus
            input = input.Replace("−", "-")
                         .Replace("–", "-")
                         .Replace("—", "-");

            // Remove all characters that are NOT digits, dot, comma, sign
            input = new string(input
                .Where(c => char.IsDigit(c) || c == '.' || c == ',' || c == '-' || c == '+')
                .ToArray());

            // Normalize decimal separator
            input = input.Replace(",", ".");

            double.TryParse(
                input,
                System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture,
                out double value);

            return value;
        }
    }
}
