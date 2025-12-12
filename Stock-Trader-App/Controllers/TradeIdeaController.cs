using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stock_Trader_App.AllData;
using Stock_Trader_App.Models;

namespace Stock_Trader_App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TradeIdeaController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public TradeIdeaController(ApplicationDbContext db)
        {
            _db = db;
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TradeIdea idea)
        {
            _db.TradeIdeas.Add(idea);
            await _db.SaveChangesAsync();
            return Ok(idea);
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.TradeIdeas.ToListAsync());
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var idea = await _db.TradeIdeas.FindAsync(id);
            if (idea == null)
                return NotFound();

            _db.TradeIdeas.Remove(idea);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
