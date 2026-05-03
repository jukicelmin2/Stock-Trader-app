using Stock_Trader_App.Models;
using Stock_Trader_App.Models.Enums;

namespace Stock_Trader_App.Tests;

// Enoti testi za model TradeIdea
public class TradeIdeaTests
{
    // Privzeti status nove ideje mora biti Idea (vrednost 3)
    [Fact]
    public void TradeIdea_PrivzetiStatus_JeIdea()
    {
        var idea = new TradeIdea();
        Assert.Equal(Status.Idea, idea.Status);
    }

    // CreatedAt se mora samodejno nastaviti na UTC čas ob ustvaritvi objekta
    [Fact]
    public void TradeIdea_PrivzetiCreatedAt_JeUtcNow()
    {
        var pred = DateTime.UtcNow.AddSeconds(-1);
        var idea = new TradeIdea();
        var po = DateTime.UtcNow.AddSeconds(1);

        Assert.InRange(idea.CreatedAt, pred, po);
    }

    // Vse lastnosti se morajo pravilno shraniti
    [Fact]
    public void TradeIdea_NastavitevLastnosti_DelujePravilno()
    {
        var expiracija = new DateTime(2025, 12, 31);
        var idea = new TradeIdea
        {
            Ticker = "AAPL",
            StrikePrice = 200.0,
            ExpirationDate = expiracija,
            Premium = 5.50,
            IV = 30.0,
            DTE = 30,
            ROI = 12.5,
            OptionType = "CALL",
            Strategy = Strategy.CoveredCall,
            Notes = "Testna ideja"
        };

        Assert.Equal("AAPL", idea.Ticker);
        Assert.Equal(200.0, idea.StrikePrice);
        Assert.Equal(expiracija, idea.ExpirationDate);
        Assert.Equal(5.50, idea.Premium, precision: 2);
        Assert.Equal(30.0, idea.IV);
        Assert.Equal(30, idea.DTE);
        Assert.Equal(12.5, idea.ROI);
        Assert.Equal("CALL", idea.OptionType);
        Assert.Equal(Strategy.CoveredCall, idea.Strategy);
        Assert.Equal("Testna ideja", idea.Notes);
    }

    // Enum Status mora imeti pravilne numerične vrednosti
    [Theory]
    [InlineData(Status.Opened, 1)]
    [InlineData(Status.Closed, 2)]
    [InlineData(Status.Idea, 3)]
    public void Status_VrednostiEnuma_SoPravilne(Status status, int pricakovanaVrednost)
    {
        Assert.Equal(pricakovanaVrednost, (int)status);
    }

    // Enum Strategy mora imeti pravilne numerične vrednosti
    [Theory]
    [InlineData(Strategy.CoveredCall, 1)]
    [InlineData(Strategy.CashSecuredPut, 2)]
    [InlineData(Strategy.Other, 3)]
    public void Strategy_VrednostiEnuma_SoPravilne(Strategy strategy, int pricakovanaVrednost)
    {
        Assert.Equal(pricakovanaVrednost, (int)strategy);
    }

    // Delta je opcijska lastnost in mora sprejeti null
    [Fact]
    public void TradeIdea_DeltaJeOpcijska_LahkoJeNull()
    {
        var idea = new TradeIdea { Delta = null };
        Assert.Null(idea.Delta);
    }

    // Delta mora sprejeti katerokoli decimalno vrednost
    [Theory]
    [InlineData(0.0)]
    [InlineData(0.5)]
    [InlineData(1.0)]
    [InlineData(-1.0)]
    public void TradeIdea_Delta_SprejmeDecimalneVrednosti(double delta)
    {
        var idea = new TradeIdea { Delta = delta };
        Assert.Equal(delta, idea.Delta);
    }

    // ROI mora sprejeti pozitivne in negativne vrednosti
    [Theory]
    [InlineData(0.0)]
    [InlineData(15.5)]
    [InlineData(-5.0)]
    public void TradeIdea_ROI_SprejmePozitinoInNegativno(double roi)
    {
        var idea = new TradeIdea { ROI = roi };
        Assert.Equal(roi, idea.ROI);
    }
}
