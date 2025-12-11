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

    // ---------------------------
    // ADD HEADERS (original)
    // ---------------------------
    private void AddHeaders(HttpClient client)
    {
        client.DefaultRequestHeaders.Clear();

        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        client.DefaultRequestHeaders.Add("Accept",
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
        client.DefaultRequestHeaders.Add("Referer", "https://finance.yahoo.com/");
        client.DefaultRequestHeaders.Add("Connection", "keep-alive");

        client.DefaultRequestHeaders.Add("Cookie",
            "A1=d=AQABBDBql2gCEMBHvV0Yn2dSQA4KFu4MpxYFEgABCAHcN2lqafKvLVQD9qMCAAcIMGqXaO4MpxY&S=AQAAAjw7CcEdcJGvlCHUMmbqPNg; " +
            "A3=d=AQABBDBql2gCEMBHvV0Yn2dSQA4KFu4MpxYFEgABCAHcN2lqafKvLVQD9qMCAAcIMGqXaO4MpxY&S=AQAAAjw7CcEdcJGvlCHUMmbqPNg;");
    }

    // ---------------------------
    // PARSER (original)
    // ---------------------------
    private List<Option> ParseOptions(string html, string ticker, OptionType type)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var result = new List<Option>();
        var rows = doc.DocumentNode.SelectNodes("//table//tbody/tr");

        if (rows == null)
            return result;

        foreach (var row in rows)
        {
            var cells = row.SelectNodes("td");
            if (cells == null || cells.Count < 11)
                continue;

            try
            {
                string contractName = cells[0].InnerText.Trim();
                DateTime expiration = DateTime.Parse(cells[1].InnerText.Trim());
                double strike = double.Parse(cells[2].InnerText.Trim(), CultureInfo.InvariantCulture);
                double premium = double.Parse(cells[3].InnerText.Trim(), CultureInfo.InvariantCulture);

                string ivStr = cells[10].InnerText.Trim().Replace("%", "");
                double iv = double.TryParse(ivStr, NumberStyles.Any,
                    CultureInfo.InvariantCulture, out var ivParsed) ? ivParsed / 100.0 : 0;

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
                    Type = type,
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


    // ---------------------------
    // CALLS (ORIGINAL)
    // ---------------------------
    public async Task<List<Option>> GetCallOptionsAsync(string ticker)
    {
        string url = $"https://finance.yahoo.com/quote/{ticker}/options/?type=calls";

        var client = _httpClientFactory.CreateClient();
        AddHeaders(client);

        string html = await client.GetStringAsync(url);
        return ParseOptions(html, ticker, OptionType.Call);
    }

    // ---------------------------
    // PUTS (IDENTICAL EXCEPT TYPE)
    // ---------------------------
    public async Task<List<Option>> GetPutOptionsAsync(string ticker)
    {
        string url = $"https://finance.yahoo.com/quote/{ticker}/options/?type=puts";

        var client = _httpClientFactory.CreateClient();
        AddHeaders(client);

        string html = await client.GetStringAsync(url);
        return ParseOptions(html, ticker, OptionType.Put);
    }

    // ---------------------------
    // MERGED
    // ---------------------------
   
    public async Task<List<Option>> GetAllOptionsAsync(string ticker)
    {
        var calls = await GetCallOptionsAsync(ticker);
        await Task.Delay(500); // avoids Yahoo block
        var puts = await GetPutOptionsAsync(ticker);

        var merged = new List<Option>();
        merged.AddRange(calls);
        merged.AddRange(puts);

        

        return merged;
    }
    public async Task<List<Option>> FilterOptionsAsync(
    string ticker,
    OptionType? type,
    double? deltaMin,
    double? deltaMax,
    double? minPremium,
    int? dteMin,
    int? dteMax)
    {
        // 1) Dohvati sve opcije (calls + puts)
        var options = await GetAllOptionsAsync(ticker);

        // 2) Filter po tipu opcije
        if (type.HasValue)
            options = options.Where(o => o.Type == type.Value).ToList();

        // 3) Filter delta min
        if (deltaMin.HasValue)
            options = options.Where(o => o.Delta.HasValue && o.Delta.Value >= deltaMin.Value).ToList();

        // 4) Filter delta max
        if (deltaMax.HasValue)
            options = options.Where(o => o.Delta.HasValue && o.Delta.Value <= deltaMax.Value).ToList();

        // 5) Filter minimalni premium
        if (minPremium.HasValue)
            options = options.Where(o => o.PremiumPrice >= minPremium.Value).ToList();

        // 6) Filter minimalni DTE
        if (dteMin.HasValue)
            options = options.Where(o => o.DTE >= dteMin.Value).ToList();

        // 7) Filter maksimalni DTE
        if (dteMax.HasValue)
            options = options.Where(o => o.DTE <= dteMax.Value).ToList();

        return options;
    }
}
