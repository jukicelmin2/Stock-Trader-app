export type Option = {
  id: string;
  ticker: string;
  contractName: string;
  expirationDate: string;
  strikePrice: number;
  premiumPrice: number;
  iv: number;
  delta: number | null;
  type: number;
  dte: number;
  roi: number;
};
