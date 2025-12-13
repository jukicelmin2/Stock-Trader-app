import type { JSX } from "react";
import type { Option } from "../../models/Option";

type Props = {
  options: Option[];
  onSaveIdea: (option: Option) => void;
};

const OptionsTable = ({ options, onSaveIdea }: Props): JSX.Element => {
  const getTypeLabel = (type: number) => (type === 1 ? "Call" : "Put");

  return (
    <table className="w-full text-sm border-collapse bg-white">
      <thead className="sticky top-0 bg-slate-50 z-10">
        <tr className="border-b border-slate-200 text-left text-slate-600 uppercase text-xs tracking-wide">
          <th className="py-3 px-3">Type</th>
          <th className="py-3 px-3">Expiration</th>
          <th className="py-3 px-3">Strike</th>
          <th className="py-3 px-3">Premium</th>
          <th className="py-3 px-3 text-center">IV</th>
          <th className="py-3 px-3 text-center">DTE</th>
          <th className="py-3 px-3 text-center">ROI</th>
          <th className="py-3 px-3 text-center">Add</th>
        </tr>
      </thead>

      <tbody>
        {options.map((o) => (
          <tr
            key={o.id}
            className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
          >
            <td className="py-3 px-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border ${
                  o.type === 1
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    o.type === 1 ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {getTypeLabel(o.type)}
              </span>
            </td>

            <td className="py-3 px-3 text-slate-800">
              {new Date(o.expirationDate).toLocaleDateString()}
            </td>

            <td className="py-3 px-3 font-mono text-slate-900">
              ${o.strikePrice.toFixed(2)}
            </td>

            <td className="py-3 px-3 font-mono text-slate-900">
              ${o.premiumPrice.toFixed(2)}
            </td>

            <td className="py-3 px-3 text-right font-mono text-sky-700">
              {(o.iv * 100).toFixed(2)}%
            </td>

            <td className="py-3 px-3 text-right font-mono text-slate-800">
              {o.dte}
            </td>

            <td className="py-3 px-3 text-right font-mono text-emerald-700">
              {o.roi.toFixed(2)}%
            </td>

            <td className="py-3 px-3 text-center">
              <button
                onClick={() => onSaveIdea(o)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-black shadow-sm"
              >
                Save
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OptionsTable;
