using Stock_Trader_App.Models;
using Stock_Trader_App.Models.Enums;

namespace Stock_Trader_App.Tests;

// Enoti testi za modela Stock in Option
public class StockModelTests
{
    // Stock mora privzeto ustvariti prazen seznam HistoricalData
    [Fact]
    public void Stock_PrivzetoHistoricalData_JePrazenSeznam()
    {
        var stock = new Stock();
        Assert.NotNull(stock.HistoricalData);
        Assert.Empty(stock.HistoricalData);
    }

    // Stock mora privzeto ustvariti prazen seznam Options
    [Fact]
    public void Stock_PrivzetoOptions_JePrazenSeznam()
    {
        var stock = new Stock();
        Assert.NotNull(stock.Options);
        Assert.Empty(stock.Options);
    }

    // Nastavitev tekstovnih lastnosti Stock
    [Fact]
    public void Stock_NastavitevLastnosti_DelujePravilno()
    {
        var stock = new Stock
        {
            Id = "abc123",
            Name = "Apple Inc.",
            Ticker = "AAPL"
        };

        Assert.Equal("abc123", stock.Id);
        Assert.Equal("Apple Inc.", stock.Name);
        Assert.Equal("AAPL", stock.Ticker);
    }

    // Dodajanje opcij v seznam Stock.Options mora povečati število elementov
    [Fact]
    public void Stock_DodajanjeOpcij_PovecaSeznam()
    {
        var stock = new Stock();
        stock.Options.Add(new Option { Ticker = "AAPL", StrikePrice = 200.0 });
        stock.Options.Add(new Option { Ticker = "AAPL", StrikePrice = 210.0 });

        Assert.Equal(2, stock.Options.Count);
    }

    // Vsak novi Option mora dobiti unikaten GUID kot Id
    [Fact]
    public void Option_PrivzetiId_JeNeprazenGuid()
    {
        var option = new Option();
        Assert.NotNull(option.Id);
        Assert.NotEmpty(option.Id);
        Assert.True(Guid.TryParse(option.Id, out _));
    }

    // Dva ločena Option objekta ne smeta imeti enakih ID-jev
    [Fact]
    public void Option_DvaNovaObjekta_ImataRazlicnaId()
    {
        var opt1 = new Option();
        var opt2 = new Option();
        Assert.NotEqual(opt1.Id, opt2.Id);
    }

    // Enum OptionType mora imeti pravilne numerične vrednosti
    [Theory]
    [InlineData(OptionType.Call, 1)]
    [InlineData(OptionType.Put, 2)]
    public void OptionType_VrednostiEnuma_SoPravilne(OptionType type, int pricakovanaVrednost)
    {
        Assert.Equal(pricakovanaVrednost, (int)type);
    }

    // Nastavitev DTE in ROI na opciji mora delovati pravilno
    [Fact]
    public void Option_NastavitevDteInRoi_DelujePravilno()
    {
        var option = new Option { DTE = 30, ROI = 15.5 };
        Assert.Equal(30, option.DTE);
        Assert.Equal(15.5, option.ROI);
    }

    // Delta na opciji je opcijska in mora sprejeti null
    [Fact]
    public void Option_DeltaJeOpcijska_LahkoJeNull()
    {
        var option = new Option { Delta = null };
        Assert.Null(option.Delta);
    }

    // Preveri pravilno nastavitev tipa opcije
    [Theory]
    [InlineData(OptionType.Call)]
    [InlineData(OptionType.Put)]
    public void Option_NastavitevTipa_DelujePravilno(OptionType tip)
    {
        var option = new Option { Type = tip };
        Assert.Equal(tip, option.Type);
    }
}
