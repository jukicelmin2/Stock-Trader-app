using Microsoft.AspNetCore.Mvc;
using Stock_Trader_App.Models.Enums;

[ApiController]
[Route("api/[controller]")]
public class OptionController : ControllerBase
{
    private readonly OptionService _optionService;

    public OptionController(OptionService optionService)
    {
        _optionService = optionService;
    }

    [HttpGet("calls/{ticker}")]
    public async Task<IActionResult> GetCalls(string ticker)
        => Ok(await _optionService.GetCallOptionsAsync(ticker));

    [HttpGet("puts/{ticker}")]
    public async Task<IActionResult> GetPuts(string ticker)
        => Ok(await _optionService.GetPutOptionsAsync(ticker));

    [HttpGet("all/{ticker}")]
    public async Task<IActionResult> GetAll(string ticker)
        => Ok(await _optionService.GetAllOptionsAsync(ticker));
    [HttpGet("filter/{ticker}")]
    public async Task<IActionResult> Filter(
    string ticker,
    OptionType? type,
    double? deltaMin,
    double? deltaMax,
    double? minPremium,
    int? dteMin,
    int? dteMax)
    {
        var result = await _optionService.FilterOptionsAsync(
            ticker, type, deltaMin, deltaMax, minPremium, dteMin, dteMax);

        return Ok(result);
    }

}

