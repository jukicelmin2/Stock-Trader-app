export type TradeIdea = {
  id?: string;
  ticker: string;

  option: {
    type: number;
    strike: number;
    expiration: string;
    premium: number;
    iv: number;
    dte: number;
    delta?: number | null;
  };

  strategy: number;
  notes: string;
  status: "Idea" | "Opened" | "Closed";
};
