import { useState } from "react";
import type { Option } from "../../models/Option";
import { createTradeIdea } from "../tradeIdea/api";

type Props = {
  option: Option;
  onClose: () => void;
};

const SaveIdeaModal = ({ option, onClose }: Props) => {
  const [strategy, setStrategy] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      await createTradeIdea({
        ticker: option.ticker,

        strikePrice: option.strikePrice,
        expirationDate: option.expirationDate,
        delta: option.delta ?? null,
        premium: option.premiumPrice,
        iv: option.iv,
        dte: option.dte,
        roi: option.roi,

        optionType: option.type === 1 ? "CALL" : "PUT",
        strategy,
        notes,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save trade idea");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Save Trade Idea
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Capture this option idea for later review.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border ${
              option.type === 1
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            {option.type === 1 ? "Call" : "Put"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-800 space-y-1">
          <div className="font-semibold text-slate-900">{option.ticker}</div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Strike ${option.strikePrice.toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Exp {new Date(option.expirationDate).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              DTE {option.dte}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            Strategy
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value={1}>Covered Call</option>
            <option value={2}>Cash Secured Put</option>
            <option value={3}>Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            rows={3}
            placeholder="Optional notes..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-black disabled:opacity-50 shadow-sm"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveIdeaModal;
