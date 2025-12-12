using Microsoft.EntityFrameworkCore;
using Stock_Trader_App.AllData;
using Stock_Trader_App.Models;
using Stock_Trader_App.Models.Enums;

namespace Stock_Trader_App.Services
{
    public class TradeIdeaService
    {
        private readonly ApplicationDbContext _db;

        public TradeIdeaService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<TradeIdea> CreateAsync(TradeIdea idea)
        {
            _db.TradeIdeas.Add(idea);
            await _db.SaveChangesAsync();
            return idea;
        }

        public async Task<List<TradeIdea>> GetAllAsync()
        {
            return await _db.TradeIdeas
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateStatusAsync(int id, Status status)
        {
            var idea = await _db.TradeIdeas.FindAsync(id);
            if (idea == null)
                throw new Exception("Trade Idea not found");

            idea.Status = status;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var idea = await _db.TradeIdeas.FindAsync(id);
            if (idea == null)
                throw new Exception("Trade Idea not found");

            _db.TradeIdeas.Remove(idea);
            await _db.SaveChangesAsync();
        }
    }
}
