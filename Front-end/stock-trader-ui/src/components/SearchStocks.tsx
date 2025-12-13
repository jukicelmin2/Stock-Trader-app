import { useEffect, useMemo, useState, type JSX } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type PriceInfo = {
  value: number;
  absoluteChange: number;
  relativeChange: number;
  date: string;
};

type HistoricalPoint = {
  atOpen: number;
  atClose: number;
  date: string;
};

type Stock = {
  id: string;
  ticker: string;
  atClosePrice: PriceInfo;
  historicalData: HistoricalPoint[];
};

const STORAGE_KEY = "watchlist";

const SearchStocks = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState<Stock | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [range, setRange] = useState<7 | 30>(7);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setWatchlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (!query.trim()) {
      setStock(null);
      setError("");
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `http://localhost:5063/api/Stock/${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error();
        const data: Stock = await res.json();
        setStock(data);
      } catch {
        setStock(null);
        setError("Stock not found");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [query]);

  const toggleWatchlist = (ticker: string) => {
    setWatchlist((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker]
    );
  };

  const isInWatchlist = stock ? watchlist.includes(stock.ticker) : false;

  const chartData = useMemo(() => {
    if (!stock) return [];

    const sorted = [...stock.historicalData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sorted.slice(-range).map((p) => ({
      date: new Date(p.date).toLocaleDateString(),
      price: p.atClose,
    }));
  }, [stock, range]);

  const firstPrice = chartData[0]?.price;
  const lastPrice = chartData[chartData.length - 1]?.price;

  const absolute =
    firstPrice !== undefined && lastPrice !== undefined
      ? lastPrice - firstPrice
      : 0;

  const relative =
    firstPrice !== undefined && lastPrice !== undefined
      ? (absolute / firstPrice) * 100
      : 0;

  const trendUp = absolute >= 0;

  return (
    <div className="px-6 pb-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Stocks</h2>
          <p className="text-sm text-gray-600">
            Find stocks and manage your watchlist
          </p>
        </div>

        <div className="relative mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Ticker (e.g. TSLA)"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
          </span>
        </div>

        {loading && (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        )}

        {!loading && error && (
          <div className="py-10 text-center text-red-600">{error}</div>
        )}

        {!loading && stock && (
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                {stock.ticker.slice(0, 2)}
              </div>
              <div className="font-semibold text-gray-900">{stock.ticker}</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDetail(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                ℹ️
              </button>

              <button
                onClick={() => toggleWatchlist(stock.ticker)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  isInWatchlist
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-900 text-white"
                }`}
              >
                {isInWatchlist ? "Added" : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetail && stock && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {stock.ticker} – Price history
              </h3>
              <button
                onClick={() => setShowDetail(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-end">
                <div className="text-sm text-gray-500">Last {range} days</div>
                <div
                  className={`text-sm font-medium ${
                    trendUp ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {trendUp ? "+" : ""}
                  {absolute.toFixed(2)} ({relative.toFixed(2)}%)
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setRange(7)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    range === 7
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => setRange(30)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    range === 30
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Last 30 days
                </button>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="priceFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={trendUp ? "#16a34a" : "#dc2626"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor={trendUp ? "#16a34a" : "#dc2626"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(v) => `$${v}`} />

                    <Tooltip
                      formatter={(v: number) => `$${v.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                      }}
                    />

                    <Legend />

                    <Area
                      type="monotone"
                      dataKey="price"
                      name="Price ($)"
                      stroke={trendUp ? "#16a34a" : "#dc2626"}
                      strokeWidth={2}
                      fill="url(#priceFill)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStocks;
