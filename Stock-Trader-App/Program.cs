using StockTrader.Api.Scrapers;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

builder.Services.AddSingleton<YahooStockScraper>();
builder.Services.AddScoped<OptionService>();

builder.Services.AddControllers();


// YAHOO scraper for stock prices
builder.Services.AddHttpClient<YahooStockScraper>(client =>
{
    client.DefaultRequestHeaders.Add("User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    AutomaticDecompression =
        DecompressionMethods.GZip |
        DecompressionMethods.Deflate |
        DecompressionMethods.Brotli
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
