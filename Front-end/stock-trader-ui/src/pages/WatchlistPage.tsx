import { useEffect, useState } from "react";
import StocksPreviewCard from "../features/stocks/StocksPreviewCard";
import StockDetailModal from "../features/stocks/StockDetailModal";
import { useWatchlist } from "../features/watchlist/useWatchlist";

type PriceInfo = {
  value: number;
  absoluteChange: number;
  relativeChange: number;
};

type StockPreview = {
  ticker: string;
  atClosePrice?: PriceInfo;
  preMarketPrice?: PriceInfo | null;
};

const WatchlistPage = () => {
  const { tickers, removeTicker } = useWatchlist();
  const [selected, setSelected] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Record<string, StockPreview>>({});
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const entries = await Promise.all(
        tickers.map(async (t) => {
          try {
            const res = await fetch(`http://localhost:5063/api/Stock/${t}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            return [t, data as StockPreview] as const;
          } catch {
            return [t, { ticker: t }] as const;
          }
        })
      );

      const next: Record<string, StockPreview> = {};
      entries.forEach(([key, value]) => {
        next[key] = value;
      });
      setStocks(next);
    };

    if (tickers.length > 0) {
      load();
    } else {
      setStocks({});
    }
  }, [tickers]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
      <h1 className="text-lg font-semibold">Watchlist</h1>

      {tickers.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-10 text-center shadow-sm">
          <div className="text-lg font-semibold text-slate-900">
            You don't have any stocks in your watchlist
          </div>
          <p className="mt-2 text-sm text-slate-700">
            Search for a ticker to add it here for quick access.
          </p>
        </div>
      )}

      {tickers.map((ticker) => (
        <StocksPreviewCard
          key={ticker}
          ticker={ticker}
          atClosePrice={stocks[ticker]?.atClosePrice}
          preMarketPrice={stocks[ticker]?.preMarketPrice}
          inWatchlist={true}
          onToggleWatchlist={() => setPendingDelete(ticker)}
          onShowDetails={() => setSelected(ticker)}
        />
      ))}

      {selected && (
        <StockDetailModal ticker={selected} onClose={() => setSelected(null)} />
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 font-semibold">
                !
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Remove from watchlist?
                </h2>
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-900">
                    {pendingDelete}
                  </span>{" "}
                  from your watchlist?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeTicker(pendingDelete);
                  setPendingDelete(null);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
