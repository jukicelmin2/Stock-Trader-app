const KEY = "watchlist";

export const getWatchlist = (): string[] => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveWatchlist = (tickers: string[]) => {
  localStorage.setItem(KEY, JSON.stringify(tickers));
};
