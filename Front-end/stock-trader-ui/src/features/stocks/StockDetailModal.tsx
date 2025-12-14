import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useOptions } from "../../features/options/useOptions";
import OptionsTable from "../../features/options/OptionsTable";
import OptionsFilters from "../../features/options/OptionsFilter";
import SaveIdeaModal from "../../features/options/SaveIdeaModal";
import type { Option } from "../../models/Option";

type HistoricalPoint = {
  atClose: number;
  date: string;
};

type Stock = {
  ticker: string;
  historicalData: HistoricalPoint[];
};

type Props = {
  ticker: string;
  onClose: () => void;
};

const StockDetailModal = ({ ticker, onClose }: Props) => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [range, setRange] = useState<7 | 30>(7);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:5063/api/Stock/${ticker}`);
      const data = await res.json();
      setStock(data);
    };
    load();
  }, [ticker]);

  const chartData = useMemo(() => {
    if (!stock) return [];
    return stock.historicalData.slice(-range).map((p) => ({
      date: new Date(p.date).toLocaleDateString(),
      price: p.atClose,
    }));
  }, [stock, range]);

  const { options, loading, setFilter, filters } = useOptions(ticker, true);

  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/90 text-lg font-semibold text-slate-600 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-200 hover:text-slate-900 hover:shadow-md cursor-pointer"
        >
          ✕
        </button>

        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{ticker} Details</h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            {[7, 30].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r as 7 | 30)}
                className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                  range === r
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Last {r} days
              </button>
            ))}
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  dataKey="price"
                  stroke="#111827"
                  fill="#111827"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-6 border-t space-y-4">
            <h4 className="text-lg font-semibold">Options</h4>

            <OptionsFilters
              type={filters.type ?? ""}
              minPremium={filters.minPremium ?? ""}
              dteMin={filters.dteMin ?? ""}
              dteMax={filters.dteMax ?? ""}
              onChange={setFilter}
            />

            {loading ? (
              <div className="text-sm text-gray-700">Loading options...</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
                  <OptionsTable
                    options={options}
                    onSaveIdea={(o) => setSelectedOption(o)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOption && (
        <SaveIdeaModal
          option={selectedOption}
          onClose={() => setSelectedOption(null)}
        />
      )}
    </div>
  );
};

export default StockDetailModal;
