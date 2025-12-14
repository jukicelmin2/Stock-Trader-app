import type { FC } from "react";

type Props = {
  ticker: string;
  atClosePrice?: {
    value: number;
    absoluteChange: number;
    relativeChange: number;
  };
  preMarketPrice?: {
    value: number;
    absoluteChange: number;
    relativeChange: number;
  } | null;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
  onShowDetails?: () => void;
};

const StocksPreviewCard: FC<Props> = ({
  ticker,
  atClosePrice,
  preMarketPrice,
  inWatchlist,
  onToggleWatchlist,
  onShowDetails,
}) => {
  const hasPre = preMarketPrice && preMarketPrice.value !== undefined;
  const price = atClosePrice?.value ?? null;
  const abs = atClosePrice?.absoluteChange ?? 0;
  const rel = atClosePrice?.relativeChange ?? 0;
  const trendUp = abs >= 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
          {ticker.slice(0, 2)}
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{ticker}</div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            {price !== null && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-gray-900">
                  ${price.toFixed(2)}
                </span>
                <span
                  className={`font-semibold ${
                    trendUp ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {trendUp ? "+" : ""}
                  {abs.toFixed(2)} ({rel.toFixed(2)}%)
                </span>
              </span>
            )}
            {hasPre && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-100">
                Pre: ${preMarketPrice!.value.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onShowDetails && (
        <button
          onClick={onShowDetails}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-black cursor-pointer"
        >
          Details
        </button>
      )}

        <button
          onClick={onToggleWatchlist}
          className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
            inWatchlist
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 ring-1 ring-emerald-300/60 hover:brightness-105"
          }`}
        >
          {inWatchlist ? "Delete" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default StocksPreviewCard;
