export type TradeIdea = {
  id: number;
  ticker: string;

  option: {
    type: number;
    strike: number;
    expiration: string;
    premium: number;
    iv: number;
    dte: number;
    roi: number;
    delta: number | null;
  };

  strategy: "CoveredCall" | "CashSecuredPut" | "Other";
  notes: string;
  status: "Idea" | "Opened" | "Closed";
};
