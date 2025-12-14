import { useTradeIdeas } from "../features/tradeIdea/useTradeIdeas";
import Header from "../components/Hero";

export default function TradeIdeasPage() {
  const { ideas, loading, deleteIdea } = useTradeIdeas();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
          Trade Ideas
        </h1>

        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg backdrop-blur">
          {loading && (
            <div className="p-8 text-slate-500 text-sm text-center">
              Loading trade ideasƒ?|
            </div>
          )}

          {!loading && ideas.length === 0 && (
            <div className="p-10 text-slate-500 text-sm text-center">
              No trade ideas found
            </div>
          )}

          {!loading &&
            ideas.map((idea) => (
              <div
                key={idea.id}
                className="px-6 py-5 border-b border-slate-200 last:border-b-0 flex justify-between items-start gap-6 transition hover:bg-slate-50/70"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
                    {idea.ticker}
                  </div>

                  <div className="text-sm text-slate-600 flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-700">
                      {idea.option.type === 1 ? "Call" : "Put"}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono">${idea.option.strike}</span>
                    <span className="text-slate-400">•</span>
                    <span className="uppercase tracking-wide text-xs">
                      {idea.option.expiration}
                    </span>
                  </div>

                  <div className="text-sm text-emerald-600 font-semibold">
                    Premium: ${idea.option.premium}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold ring-1 ring-slate-200">
                      Exp: {idea.option.expiration}
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
                  </div>

                  {idea.notes && (
                    <div className="text-sm text-slate-500 italic">
                      {idea.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition border border-red-100 shadow-sm"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
