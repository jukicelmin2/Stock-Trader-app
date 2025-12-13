import { useState } from "react";
import type { JSX } from "react";
import type { Option } from "../../models/Option";
import SaveIdeaModal from "./SaveIdeaModal";

const OptionsTable = ({ options }: { options: Option[] }): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const getTypeLabel = (type: number) => (type === 1 ? "Call" : "Put");

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-100">
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 px-3 text-slate-900">Type</th>
              <th className="py-2 px-3 text-slate-900">Expiration</th>
              <th className="py-2 px-3 text-center text-slate-900">Strike</th>
              <th className="py-2 px-3 text-center text-slate-900">Premium</th>
              <th className="py-2 px-3 text-center text-slate-900">IV</th>
              <th className="py-2 px-3 text-center text-slate-900">DTE</th>
              <th className="py-2 px-3 text-center text-slate-900">ROI</th>

              <th className="py-2 px-3"></th>
            </tr>
          </thead>

          <tbody>
            {options.map((o, idx) => (
              <tr
                key={o.id}
                className={`border-b border-slate-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                } hover:bg-slate-100 transition`}
              >
                <td className="py-2 px-3 font-medium text-slate-900">
                  {getTypeLabel(o.type)}
                </td>

                <td className="py-2 px-3 text-slate-800">
                  {new Date(o.expirationDate).toLocaleDateString()}
                </td>

                <td className="py-2 px-3 text-center font-mono text-slate-900">
                  ${o.strikePrice.toFixed(2)}
                </td>

                <td className="py-2 px-3 text-center font-mono text-slate-900">
                  ${o.premiumPrice.toFixed(2)}
                </td>

                <td className="py-2 px-3 text-center font-mono text-sky-700">
                  {(o.iv * 100).toFixed(2)}%
                </td>

                <td className="py-2 px-3 text-center font-mono text-slate-900">
                  {o.dte}
                </td>

                <td className="py-2 px-3 text-center font-mono text-emerald-700">
                  {o.roi.toFixed(2)}%
                </td>

                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => setSelectedOption(o)}
                    className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-200 hover:text-slate-900 transition"
                  >
                    Save idea
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SaveIdeaModal
        option={selectedOption}
        onClose={() => setSelectedOption(null)}
      />
    </>
  );
};

export default OptionsTable;
