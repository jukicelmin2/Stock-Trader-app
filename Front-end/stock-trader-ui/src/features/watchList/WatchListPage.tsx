import { useEffect, useState } from "react";
import StocksPreviewCard from "../stocks/StocksPreviewCard";
import StockDetailModal from "../stocks/StockDetailModal";
import { useWatchlist } from "./useWatchList";

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

const WatchListPage = () => {
  const { tickers, removeTicker } = useWatchlist();
  const [selected, setSelected] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Record<string, StockPreview>>({});

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

      {tickers.map((ticker) => (
        <StocksPreviewCard
          key={ticker}
          ticker={ticker}
          atClosePrice={stocks[ticker]?.atClosePrice}
          preMarketPrice={stocks[ticker]?.preMarketPrice}
          inWatchlist={true}
          onToggleWatchlist={() => removeTicker(ticker)}
          onShowDetails={() => setSelected(ticker)}
        />
      ))}

      {selected && (
        <StockDetailModal ticker={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default WatchListPage;
