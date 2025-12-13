import type { TradeIdea } from "../../models/TradeIdea";

type Props = {
  ideas: TradeIdea[];
  onDelete: (id: number) => void;
};

const TradeIdeasTable = ({ ideas, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
      <table className="w-full text-sm border-collapse table-fixed">
        <thead className="bg-slate-100">
          <tr className="border-b border-slate-300">
            <th className="px-3 py-2 text-left">Ticker</th>
            <th className="px-3 py-2 text-right">Strike</th>
            <th className="px-3 py-2 text-right">Expiration</th>
            <th className="px-3 py-2 text-right">Premium</th>
            <th className="px-3 py-2 text-right">IV</th>
            <th className="px-3 py-2 text-right">DTE</th>
            <th className="px-3 py-2 text-right">Status</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>

        <tbody>
          {ideas.map((i) => (
            <tr key={i.id} className="border-b">
              <td className="px-3 py-2 font-medium">{i.ticker}</td>
              <td className="px-3 py-2 text-right font-mono">
                ${i.option.strike.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right">
                {new Date(i.option.expiration).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 text-right font-mono">
                ${i.option.premium.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right font-mono">
                {(i.option.iv * 100).toFixed(2)}%
              </td>
              <td className="px-3 py-2 text-right font-mono">{i.option.dte}</td>
              <td className="px-3 py-2 text-right text-xs">{i.status}</td>
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => onDelete(i.id!)}
                  className="text-xs underline text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeIdeasTable;
