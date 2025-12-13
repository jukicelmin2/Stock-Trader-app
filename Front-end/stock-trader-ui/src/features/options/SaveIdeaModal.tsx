import { useState } from "react";
import type { Option } from "../../models/Option";
import { createTradeIdea } from "../tradeIdea/api";

type StrategyKey = "CoveredCall" | "CashSecuredPut" | "Other";

const strategyMap: Record<StrategyKey, number> = {
  CoveredCall: 1,
  CashSecuredPut: 2,
  Other: 3,
};

type Props = {
  option: Option | null;
  onClose: () => void;
};

const SaveIdeaModal = ({ option, onClose }: Props) => {
  const [strategy, setStrategy] = useState<StrategyKey>("CoveredCall");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!option) return null;

  const handleSave = async () => {
    setSaving(true);

    try {
      await createTradeIdea({
        ticker: option.ticker,

        strikePrice: option.strikePrice,
        expirationDate: new Date(option.expirationDate).toISOString(),
        premium: option.premiumPrice,
        iv: option.iv,
        dte: option.dte,
        delta: option.delta ?? null,
        roi: option.roi,

        optionType: option.type === 1 ? "CALL" : "PUT",

        strategy: strategyMap[strategy],
        notes,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save idea");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-5 space-y-4">
        <h2 className="text-lg font-semibold">Save Trade Idea</h2>

        <div className="text-sm text-slate-700">
          <b>{option.ticker}</b> {option.type === 1 ? "Call" : "Put"}
        </div>

        <div>
          <label className="text-xs text-slate-600">Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as StrategyKey)}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="CoveredCall">Covered Call</option>
            <option value="CashSecuredPut">Cash Secured Put</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-600">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1 text-sm rounded bg-slate-900 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveIdeaModal;
