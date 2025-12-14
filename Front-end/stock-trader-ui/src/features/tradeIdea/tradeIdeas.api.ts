import type { TradeIdea } from "../../models/TradeIdea";

const BASE_URL = "http://localhost:5063/api/TradeIdea";

export async function getAllTradeIdeas(): Promise<TradeIdea[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error();
  return res.json();
}

export async function deleteTradeIdeaById(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error();
}
