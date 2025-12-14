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

  strategy: number;
  notes: string;
};
