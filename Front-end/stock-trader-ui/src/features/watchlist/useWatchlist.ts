import { useEffect, useState } from "react";
import { getWatchlist, saveWatchlist } from "../watchlist/storage";

export const useWatchlist = () => {
  const [tickers, setTickers] = useState<string[]>([]);

  useEffect(() => {
    setTickers(getWatchlist());
  }, []);

  const addTicker = (ticker: string) => {
    const t = ticker.toUpperCase();
    if (tickers.includes(t)) return;

    const updated = [...tickers, t];
    setTickers(updated);
    saveWatchlist(updated);
  };

  const removeTicker = (ticker: string) => {
    const updated = tickers.filter((t) => t !== ticker);
    setTickers(updated);
    saveWatchlist(updated);
  };

  return {
    tickers,
    addTicker,
    removeTicker,
  };
};
