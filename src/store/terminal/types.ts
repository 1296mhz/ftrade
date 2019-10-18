export type TerminalState = {
  tickers: string[],
  positions: Position[],
  symbols: Symbol[],
  orders: Order[],
  stockOptions: {
    rangeSelector: {
      selected: number,
    },
    title: {
      text: string,
    },
    series: Series[],
  }
};

export type Series = {
  name: string,
  data: number[],
  pointStart: string,
  pointInterval: number,
  tooltip: {
    valueDecimals: number
  }
};

export type Symbol = {
  ticker: string,
  color: string,
  bid: number,
  ask: number,
};

export type Position = {
  id: number,
  ticker: string,
  position: number,
  avgprice: number,
  price: number,
  pnl: number,
};

export type Order = {
  id: number,
  state: string,
  ticker: string,
  type: string,
  side:string,
  quantity: number,
  time: string,
};



