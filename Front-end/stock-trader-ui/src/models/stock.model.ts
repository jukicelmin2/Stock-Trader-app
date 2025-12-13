export interface Price {
  value: number;
  absoluteChange: number;
  relativeChange: number;
  date: string;
}
export interface HistoricalPrice {
  date: string;
  atOpen: number;
  atClose: number;
}
export interface Stock {
  id: string;
  name: string;
  ticker: string;
  atClosePrice: Price;
  preMarketPrice: Price;
  historicalData: HistoricalPrice[];
}
