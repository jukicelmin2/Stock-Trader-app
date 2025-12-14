import type { Option } from "../../models/Option";

const BASE = "http://localhost:5063/api/Option";

export const getAllOptions = async (ticker: string): Promise<Option[]> => {
  const res = await fetch(`${BASE}/all/${ticker}`);
  if (!res.ok) throw new Error("Failed to fetch options");
  return res.json();
};

export const filterOptions = async (
  ticker: string,
  params: Record<string, string | number>
): Promise<Option[]> => {
  const qs = new URLSearchParams(params as any).toString();
  const res = await fetch(`${BASE}/filter/${ticker}?${qs}`);
  if (!res.ok) throw new Error("Failed to filter options");
  return res.json();
};
