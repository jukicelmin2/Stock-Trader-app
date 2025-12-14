import { useState } from "react";
import { useTradeIdeas } from "../features/tradeIdea/useTradeIdeas";
import Header from "../components/Hero";

type PendingDelete = {
  id: number;
  ticker: string;
};

export default function TradeIdeasPage() {
  const { ideas, loading, deleteIdea } = useTradeIdeas();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
          Trade Ideas
        </h1>

        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg backdrop-blur p-4 space-y-4">
          {loading && (
            <div className="p-8 text-slate-700 text-sm text-center">
              Loading trade ideas...
            </div>
          )}

          {!loading && ideas.length === 0 && (
            <div className="p-10 text-slate-700 text-sm text-center">
              No trade ideas found
            </div>
          )}

          {!loading &&
            ideas.map((idea) => {
              const expirationLabel = new Date(
                idea.option.expiration
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              const strategyLabel =
                idea.strategy === "CoveredCall"
                  ? "Covered Call"
                  : idea.strategy === "CashSecuredPut"
                  ? "Cash Secured Put"
                  : "Other";

              const handleDelete = () => {
                setPendingDelete({ id: idea.id, ticker: idea.ticker });
              };

              return (
                <div
                  key={idea.id}
                  className="flex items-start justify-between gap-6 rounded-xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 px-6 py-5 shadow-sm transition hover:shadow-md hover:-translate-y-[1px]"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-sm font-semibold shadow-sm">
                      {idea.ticker}
                    </div>

                    <div className="text-sm text-slate-700 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-200/80 px-3 py-1 font-semibold text-slate-900">
                        {idea.option.type === 1 ? "Call" : "Put"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        {strategyLabel}
                      </span>
                      <span className="text-slate-500" aria-hidden="true">
                        &middot;
                      </span>
                      <span className="font-mono text-slate-900">
                        ${idea.option.strike}
                      </span>
                      <span className="text-slate-500" aria-hidden="true">
                        &middot;
                      </span>
                      <span className="uppercase tracking-wide text-xs text-slate-800">
                        {expirationLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold ring-1 ring-slate-200 text-slate-900">
                        Exp: {expirationLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        IV: {(idea.option.iv * 100).toFixed(2)}%
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 ring-1 ring-blue-100">
                        DTE: {idea.option.dte.toFixed(2)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700 ring-1 ring-amber-100">
                        ROI: {idea.option.roi.toFixed(2)}%
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 font-semibold text-purple-700 ring-1 ring-purple-100">
                        Delta: {idea.option.delta ?? "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900 text-emerald-50 px-3 py-1 font-semibold">
                        Premium: ${idea.option.premium}
                      </span>
                    </div>

                    {idea.notes && (
                      <div className="text-sm text-slate-700 italic bg-white/80 border border-slate-200 rounded-lg px-3 py-2">
                        {idea.notes}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleDelete}
                    className="self-start text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition border border-red-200 shadow-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
      </main>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 font-semibold">
                !
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Delete trade idea?
                </h2>
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-900">
                    {pendingDelete.ticker}
                  </span>{" "}
                  from your trade ideas?
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
                  if (pendingDelete) deleteIdea(pendingDelete.id);
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
}
