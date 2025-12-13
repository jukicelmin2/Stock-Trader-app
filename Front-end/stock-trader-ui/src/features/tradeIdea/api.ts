import type { TradeIdeaCreateRequest } from "./types";

const BASE_URL = "http://localhost:5063/api/TradeIdea";

// CREATE
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
