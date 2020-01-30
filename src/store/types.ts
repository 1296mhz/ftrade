// Main state interface
export interface IMainState {
  connected: boolean;
  errors: string[];
  userId: string;
}

// Virtual account
export interface IVAccount {
  id: string;
  name: string;
  executor: string;
  raccount: string;
}

// Real account
export interface IRAccount {
  id: string;
  name: string;
  executor: string;
}

// Symbol
export interface ISymbol {
  ticker: string;
  type: string;
  currency: string;
  exchange: string;
  minIncrement: number;
  minIncrementAmount: number;
  bid: number;
  ask: number;
}

// Order
export interface IOrder {
  id: string;
  ticker: string;
  account: string;
  side: string;
  price: number;
  volume: number;
  leaves: number;
  state: string;
  time: number;
}

// Trade
export interface ITrade {
  id: string;
  ticker: string;
  account: string;
  order: string;
  side: string;
  price: number;
  volume: number;
  time: number;
  fee: number;
}

// Test
export interface ITest {
  id: string;
  name: string;
  parent: string;
  state: string;
  progress: number;
  begin: number;
  end: number;
  interval: number;
  strategies: IStrategy[];
}

// Strategy
export interface IStrategy {
  id: string;
  name: string;
  source: string;
  instruments: IInstrument[];
}

// Instrument
export interface IInstrument {
  ticker: string;
  account: string;
  position: number;
}

// LogEntry
export interface ILogEntry {
  time: number;
  level: number;
  text: TemplateStringsArray;
}
