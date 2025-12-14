import { useEffect, useState, type JSX } from "react";

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
  const [localType, setLocalType] = useState(type);
  const [localMinPremium, setLocalMinPremium] = useState(minPremium);
  const [localDteMin, setLocalDteMin] = useState(dteMin);
  const [localDteMax, setLocalDteMax] = useState(dteMax);

  useEffect(() => {
    setLocalType(type);
    setLocalMinPremium(minPremium);
    setLocalDteMin(dteMin);
    setLocalDteMax(dteMax);
  }, [type, minPremium, dteMin, dteMax]);

  const applyFilters = () => {
    onChange("type", localType);
    onChange("minPremium", localMinPremium);
    onChange("dteMin", localDteMin);
    onChange("dteMax", localDteMax);
  };

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-300 bg-slate-100 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">Type</label>
        <select
          value={localType}
          onChange={(e) => setLocalType(e.target.value)}
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
          value={localMinPremium}
          onChange={(e) => setLocalMinPremium(e.target.value)}
          className="w-32 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">DTE Min</label>
        <input
          type="number"
          placeholder="0"
          value={localDteMin}
          onChange={(e) => setLocalDteMin(e.target.value)}
          className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">DTE Max</label>
        <input
          type="number"
          placeholder="365"
          value={localDteMax}
          onChange={(e) => setLocalDteMax(e.target.value)}
          className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      <button
        onClick={applyFilters}
        className="ml-auto inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black cursor-pointer"
      >
        Apply filters
      </button>
    </div>
  );
};

export default OptionsFilters;
