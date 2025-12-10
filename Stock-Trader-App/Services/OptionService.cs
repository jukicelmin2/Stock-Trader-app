using HtmlAgilityPack;
using Stock_Trader_App.Models;
using Stock_Trader_App.Models.Enums;
using System.Globalization;

public class OptionService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public OptionService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<List<Option>> GetCallOptionsAsync(string ticker)
    {
        string url = $"https://finance.yahoo.com/quote/{ticker}/options/?type=puts";

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        client.DefaultRequestHeaders.Add("Accept",
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
        client.DefaultRequestHeaders.Add("Referer", "https://finance.yahoo.com/");
        client.DefaultRequestHeaders.Add("Connection", "keep-alive");

        // Yahoo requires cookies to unlock options table correctly
        client.DefaultRequestHeaders.Add("Cookie",
            "A1=d=AQABBDBql2gCEMBHvV0Yn2dSQA4KFu4MpxYFEgABCAHcN2lqafKvLVQD9qMCAAcIMGqXaO4MpxY&S=AQAAAjw7CcEdcJGvlCHUMmbqPNg; " +
            "A3=d=AQABBDBql2gCEMBHvV0Yn2dSQA4KFu4MpxYFEgABCAHcN2lqafKvLVQD9qMCAAcIMGqXaO4MpxY&S=AQAAAjw7CcEdcJGvlCHUMmbqPNg;"
        );

        string html = await client.GetStringAsync(url);

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var result = new List<Option>();

        var rows = doc.DocumentNode.SelectNodes("//table//tbody/tr");
        if (rows == null)
            return result;

        foreach (var row in rows)
        {
            var cells = row.SelectNodes("td");
            if (cells is null || cells.Count < 11)
                continue;

            try
            {
                string contractName = cells[0].InnerText.Trim();
                DateTime expiration = DateTime.Parse(cells[1].InnerText.Trim());

                double strike = double.Parse(cells[2].InnerText.Trim(), CultureInfo.InvariantCulture);
                double premium = double.Parse(cells[3].InnerText.Trim(), CultureInfo.InvariantCulture);

                string ivStr = cells[10].InnerText.Trim().Replace("%", "");
                double iv = double.TryParse(ivStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var ivParsed)
                    ? ivParsed / 100.0
                    : 0;

                int dte = (expiration - DateTime.UtcNow).Days;
                double roi = strike == 0 ? 0 : (premium / strike) * 100;

                result.Add(new Option
                {
                    Ticker = ticker.ToUpper(),
                    ContractName = contractName,
                    ExpirationDate = expiration,
                    StrikePrice = strike,
                    PremiumPrice = premium,
                    IV = iv,
                    Delta = null,
                    Type = OptionType.Call,
                    DTE = dte,
                    ROI = roi
                });
            }
            catch
            {
                continue;
            }
        }

        return result;
    }
}
