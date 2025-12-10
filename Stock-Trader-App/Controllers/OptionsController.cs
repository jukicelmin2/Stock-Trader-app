using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> GetCallOptions(string ticker)
    {
        if (string.IsNullOrWhiteSpace(ticker))
            return BadRequest("Ticker is required.");

        var options = await _optionService.GetCallOptionsAsync(ticker);

        return Ok(options);
    }
}
