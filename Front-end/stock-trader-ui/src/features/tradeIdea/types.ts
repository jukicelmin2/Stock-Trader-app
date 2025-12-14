export type TradeIdeaCreateRequest = {
  ticker: string;

  strikePrice: number;
  expirationDate: string;
  delta?: number | null;
  premium: number;
  iv: number;
  dte: number;
  roi: number;

  optionType: "CALL" | "PUT";

  strategy: number; // enum 1 | 2 | 3
  notes: string;
};
