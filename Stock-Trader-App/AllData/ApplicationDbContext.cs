using Microsoft.EntityFrameworkCore;
using Stock_Trader_App.Models;

namespace Stock_Trader_App.AllData
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TradeIdea> TradeIdeas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TradeIdea>()
                .ToTable("TradeIdeas");

            modelBuilder.Entity<TradeIdea>()
                .Property(t => t.Strategy)
                .HasConversion<string>();

            modelBuilder.Entity<TradeIdea>()
                .Property(t => t.Status)
                .HasConversion<string>();
        }
    }
}