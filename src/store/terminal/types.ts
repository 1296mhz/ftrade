export interface TerminalState {
  tickers: string[];
  positions: IPosition[];
  symbols: ISymbol[];
  orders: IOrder[];
  ohlc: [],
  currentOhlc: {
    ticker: string;
    min: number;
    max: number;
    type: string;
  };
  stockOptions?: {
    rangeSelector: {
      selected: number;
    };
    title: {
      text: string;
    };
    series: ISeries[];
  };
  xAxis?: {
    events?: {
      afterSetExtremes?: any;
    };
    minRange?: number;
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

export interface IOrder  {
  id: number;
  state: string;
  ticker: string;
  type: string;
  side: string;
  quantity: number;
  time: string;
}


export interface IOhlcParams  {
  ticker: string;
  interval: string;
  begin: number;
  end: number;
}

export interface IOhlc  {
  ticker: string;
  series: number[];
}



