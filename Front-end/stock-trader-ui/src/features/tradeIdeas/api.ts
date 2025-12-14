import type { TradeIdeaCreateRequest } from "./types";
import type { TradeIdea } from "../../models/TradeIdea";

const BASE_URL = "http://localhost:5063/api/TradeIdea";

export const getAllTradeIdeas = async (): Promise<TradeIdea[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Failed to load trade ideas");
  }
  return res.json();
};

export const deleteTradeIdeaById = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete trade idea");
  }
};

export const createTradeIdea = async (payload: TradeIdeaCreateRequest) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create trade idea");
  }

  return res.json();
};
