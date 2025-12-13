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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{ticker} Details</h3>
          <button
            onClick={onClose}
            className="text-xl text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* RANGE */}
          <div className="flex gap-2">
            {[7, 30].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r as 7 | 30)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  range === r
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Last {r} days
              </button>
            ))}
          </div>

          {/* CHART */}
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

          {/* OPTIONS */}
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
              <div className="text-sm text-gray-500">Loading options...</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[320px] overflow-y-auto">
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
