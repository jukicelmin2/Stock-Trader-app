import { useEffect, useState } from "react";
import type { TradeIdea } from "../../models/TradeIdea";
import {
  deleteTradeIdeaById,
  getAllTradeIdeas,
} from "./api";

export const useTradeIdeas = () => {
  const [ideas, setIdeas] = useState<TradeIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadIdeas = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllTradeIdeas();

      const mapped: TradeIdea[] = data.map((i: any) => ({
        id: Number(i.id),
        ticker: i.ticker,
        option: {
          type: i.optionType === "CALL" ? 1 : 2,
          strike: i.strikePrice,
          expiration: i.expirationDate,
          premium: i.premium,
          iv: i.iv,
          dte: i.dte,
          roi: i.roi,
          delta: i.delta ?? null,
        },
        strategy:
          i.strategy === 1
            ? "CoveredCall"
            : i.strategy === 2
            ? "CashSecuredPut"
            : "Other",
        notes: i.notes ?? "",
        status: i.status === 0 ? "Idea" : i.status === 1 ? "Opened" : "Closed",
      }));

      setIdeas(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load trade ideas");
    } finally {
      setLoading(false);
    }
  };

  const deleteIdea = async (id: number) => {
    try {
      await deleteTradeIdeaById(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete trade idea");
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  return {
    ideas,
    loading,
    error,
    reload: loadIdeas,
    deleteIdea,
  };
};
