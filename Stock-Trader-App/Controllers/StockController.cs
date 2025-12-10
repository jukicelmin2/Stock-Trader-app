using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockTrader.Api.Scrapers;

namespace Stock_Trader_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly YahooStockScraper _scraper;
        public StockController(YahooStockScraper scraper)
        {
            _scraper = scraper;
        }

        
        [HttpGet("{ticker}")]
        public async Task<IActionResult> GetStock(string ticker)
        {
            var stock = await _scraper.GetStockAsync(ticker);
            return Ok(stock); // vrne JSON
        }

    }
}
