import type { JSX } from "react";

type Props = {
  type: string;
  minPremium: string;
  dteMin: string;
  dteMax: string;
  onChange: (key: string, value: string) => void;
};

const OptionsFilters = ({
  type,
  minPremium,
  dteMin,
  dteMax,
  onChange,
}: Props): JSX.Element => {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-300 bg-slate-100 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">Type</label>
        <select
          value={type}
          onChange={(e) => onChange("type", e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="">All</option>
          <option value="1">Call</option>
          <option value="2">Put</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">Min Premium ($)</label>
        <input
          type="number"
          placeholder="0.00"
          value={minPremium}
          onChange={(e) => onChange("minPremium", e.target.value)}
          className="w-32 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">DTE Min</label>
        <input
          type="number"
          placeholder="0"
          value={dteMin}
          onChange={(e) => onChange("dteMin", e.target.value)}
          className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">DTE Max</label>
        <input
          type="number"
          placeholder="365"
          value={dteMax}
          onChange={(e) => onChange("dteMax", e.target.value)}
          className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>
    </div>
  );
};

export default OptionsFilters;
