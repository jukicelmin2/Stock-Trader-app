import type { FC } from "react";

const Hero: FC = () => {
  return (
    <div className="px-6 pt-10 pb-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-800 text-white shadow-xl">
        <div className="p-8 sm:p-10 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide">
            Live Market Overview
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Stock Trader Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-200">
              Track tickers, screen option chains, and save trade ideas with a
              clean, focused workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl bg-white/10 px-4 py-3 border border-white/10">
              <div className="text-slate-200">Watchlist</div>
              <div className="text-lg font-semibold text-white">Curate tickers</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 border border-white/10">
              <div className="text-slate-200">Options</div>
              <div className="text-lg font-semibold text-white">Filter and save</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 border border-white/10">
              <div className="text-slate-200">Ideas</div>
              <div className="text-lg font-semibold text-white">Log strategies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
