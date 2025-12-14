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

    private void AddHeaders(HttpClient client)
    {
        client.DefaultRequestHeaders.Clear();

        client.DefaultRequestHeaders.Add(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        );

        client.DefaultRequestHeaders.Add(
            "Accept",
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        );

        client.DefaultRequestHeaders.Add(
            "Accept-Language",
            "en-US,en;q=0.9"
        );

        client.DefaultRequestHeaders.Add(
            "Referer",
            "https://finance.yahoo.com/"
        );

        client.DefaultRequestHeaders.Add(
            "Connection",
            "keep-alive"
        );

        client.DefaultRequestHeaders.Add(
            "Cookie",
            "A1=d=AQABBDBql2gCEMBHvV0Yn2dSQA4KFu4MpxYFEgABCAHcN2lqafKvLVQD9qMCAAcIMGqXaO4MpxY&S=AQAAAjw7CcEdcJGvlCHUMmbqPNg; " +
            "A3=d=AQABBDBql2gCEMBHvV0Yn2dSQA4KFu4MpxYFEgABCAHcN2lqafKvLVQD9qMCAAcIMGqXaO4MpxY&S=AQAAAjw7CcEdcJGvlCHUMmbqPNg;"
        );
    }

    private List<Option> ParseOptions(string html, string ticker, OptionType type)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var result = new List<Option>();
        var rows = doc.DocumentNode.SelectNodes("//table//tbody/tr");

        var closePriceNode = doc.DocumentNode
            .SelectSingleNode("//span[@data-testid='qsp-price']");

        double closePrice = TryParseDouble(closePriceNode?.InnerText);

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

                DateTime expiration = DateTime.Parse(
                    cells[1].InnerText.Trim(),
                    CultureInfo.GetCultureInfo("en-US"),
                    DateTimeStyles.AssumeLocal
                );

                double strike = double.Parse(
                    cells[2].InnerText.Trim(),
                    CultureInfo.InvariantCulture
                );

                double premium = double.Parse(
                    cells[3].InnerText.Trim(),
                    CultureInfo.InvariantCulture
                );

                string ivStr = cells[10]
                    .InnerText
                    .Trim()
                    .Replace("%", "");

                double iv =
                    double.TryParse(
                        ivStr,
                        NumberStyles.Any,
                        CultureInfo.InvariantCulture,
                        out var ivParsed
                    )
                        ? ivParsed / 100.0
                        : 0;

                int dte = Math.Max(
                    1,
                    ( DateTime.Today-expiration.Date).Days
                );

                double roi = 0;

               
                    roi =
                        (premium / closePrice) *
                        (365.0 / dte);
                

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

    private double TryParseDouble(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return 0;

        input = input.Trim();

        input = input
            .Replace("−", "-")
            .Replace("–", "-")
            .Replace("—", "-");

        input = new string(
            input
                .Where(c =>
                    char.IsDigit(c) ||
                    c == '.' ||
                    c == ',' ||
                    c == '-' ||
                    c == '+'
                )
                .ToArray()
        );

        input = input.Replace(",", ".");

        double.TryParse(
            input,
            NumberStyles.Any,
            CultureInfo.InvariantCulture,
            out double value
        );

        return value;
    }

    public async Task<List<Option>> GetCallOptionsAsync(string ticker)
    {
        string url =
            $"https://finance.yahoo.com/quote/{ticker}/options/?type=calls";

        var client = _httpClientFactory.CreateClient();
        AddHeaders(client);

        string html = await client.GetStringAsync(url);

        return ParseOptions(html, ticker, OptionType.Call);
    }

    public async Task<List<Option>> GetPutOptionsAsync(string ticker)
    {
        string url =
            $"https://finance.yahoo.com/quote/{ticker}/options/?type=puts";

        var client = _httpClientFactory.CreateClient();
        AddHeaders(client);

        string html = await client.GetStringAsync(url);

        return ParseOptions(html, ticker, OptionType.Put);
    }

    public async Task<List<Option>> GetAllOptionsAsync(string ticker)
    {
        var calls = await GetCallOptionsAsync(ticker);
        await Task.Delay(500);
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
        int? dteMax
    )
    {
        var options = await GetAllOptionsAsync(ticker);

        if (type.HasValue)
            options = options
                .Where(o => o.Type == type.Value)
                .ToList();

        if (deltaMin.HasValue)
            options = options
                .Where(o =>
                    o.Delta.HasValue &&
                    o.Delta.Value >= deltaMin.Value
                )
                .ToList();

        if (deltaMax.HasValue)
            options = options
                .Where(o =>
                    o.Delta.HasValue &&
                    o.Delta.Value <= deltaMax.Value
                )
                .ToList();

        if (minPremium.HasValue)
            options = options
                .Where(o => o.PremiumPrice >= minPremium.Value)
                .ToList();

        if (dteMin.HasValue)
            options = options
                .Where(o => o.DTE >= dteMin.Value)
                .ToList();

        if (dteMax.HasValue)
            options = options
                .Where(o => o.DTE <= dteMax.Value)
                .ToList();

        return options;
    }
}
