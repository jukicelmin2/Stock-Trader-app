using System.Threading.Tasks;

public interface IOptionService
{
    Task<object> GetRealtimeOptionsAsync(string symbol);
}
