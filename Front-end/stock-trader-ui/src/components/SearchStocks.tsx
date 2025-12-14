import { useEffect, useState, type JSX } from "react";
import StocksPreviewCard from "../features/stocks/StocksPreviewCard";
import StockDetailModal from "../features/stocks/StockDetailModal";
import { useWatchlist } from "../features/watchList/useWatchList";

type PriceInfo = {
  value: number;
  absoluteChange: number;
  relativeChange: number;
};

type Stock = {
  ticker: string;
  atClosePrice?: PriceInfo;
  preMarketPrice?: PriceInfo | null;
};

const SearchStocks = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  const { tickers, addTicker, removeTicker } = useWatchlist();

  const isInWatchlist = stock ? tickers.includes(stock.ticker) : false;

  useEffect(() => {
    const ticker = query.trim().toUpperCase();

    if (!ticker) {
      setStock(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5063/api/Stock/${ticker}`);
        if (!res.ok) throw new Error("not found");

        const data = await res.json();
        const matchesQuery =
          data?.ticker && data.ticker.toUpperCase() === ticker;
        const hasPrice =
          data?.atClosePrice &&
          Number.isFinite(data.atClosePrice.value) &&
          data.atClosePrice.value > 0;

        if (!matchesQuery || !hasPrice) throw new Error("not found");

        setStock(data);
      } catch {
        setError("Stock not found");
        setStock(null);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="px-6 pb-10 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">
            Quick Search
          </div>
          <div className="text-xs text-slate-700">
            Find a ticker, view live details, and save it to your watchlist.
          </div>
        </div>

        <div className="p-5 space-y-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Ticker (e.g. TSLA)"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />

          {loading && (
            <div className="text-sm text-slate-600">Loading...</div>
          )}
          {error && <div className="text-sm text-rose-600">{error}</div>}

          {stock && (
            <StocksPreviewCard
              ticker={stock.ticker}
              atClosePrice={stock.atClosePrice}
              preMarketPrice={stock.preMarketPrice}
              inWatchlist={isInWatchlist}
              onToggleWatchlist={() =>
                isInWatchlist
                  ? removeTicker(stock.ticker)
                  : addTicker(stock.ticker)
              }
              onShowDetails={() => setShowDetail(true)}
            />
          )}
        </div>
      </div>

      {showDetail && stock && (
        <StockDetailModal
          ticker={stock.ticker}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default SearchStocks;
