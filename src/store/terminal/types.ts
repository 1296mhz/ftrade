export interface TerminalState {
  tickers: string[];
  positions: IPosition[];
  symbols: ISymbol[];
  orders: IOrder[];
  symbolSelected: string;
  loadingText: string;
  errorText: string;
  loadingSymbols: boolean;
  errorSymbols: boolean;
  loadingOhlc: boolean;
  errorOhlc: boolean;
  currentSymbol: {
    ticker: string;
    currency: string;
    exchange: string;
    minIncrement: number;
    minIncrementAmount: number;
    bid: number;
    ask: number;
    type: string;
    ohlcNavigator: {
      data: Array<[]>;
      begin: number;
      end: number;
      interval: string;
    }
    ohlc: {
      data: Array<[]>;
      begin: number;
      end: number;
      interval: string;
    };
  };
}

export interface ISeries {
  name: string;
  data: number[];
  pointStart: string;
  pointInterval: number;
  tooltip: {
    valueDecimals: number;
  };
}

interface ISymbol {
  ticker: string;
  color: string;
  bid: number;
  ask: number;
}

export interface IPosition {
  id: number;
  ticker: string;
  position: number;
  avgprice: number;
  price: number;
  pnl: number;
}

export interface IOrder {
  account: string;
  id: string;
  leaves: number;
  price: number;
  side: string;
  state: string;
  symbol: string;
  time: number;
  volume: number;
}

export interface IOhlcParams {
  ticker: string;
  interval: string;
  begin: number;
  end: number;
}

export interface IOhlc {
  ticker: string;
  series: number[];
}

