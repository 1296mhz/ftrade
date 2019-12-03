import { AppState} from './app/types';
import { IAuthState} from './auth/types';
import { TerminalState } from './terminal/types';

// Main state interface
export interface IMainState {
  connected: boolean;
  error: string;
  userId: string;

  // Accounts
  accounts: IAccount[];

  // Modules
  app: AppState;
  auth: IAuthState;
  // terminal: TerminalState;
}

// Login action payload
export interface ILoginPayload {
  username: string;
  password: string;
}

// User account
export interface IAccount {
  id: string;
  name: string;
}

// Terminal state interface
export interface ITerminalState {
  symbols: ISymbol[];

  account: string;
  orders: IOrder[];
  trades: ITrade[];
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

// Cancel order action payload
export interface ICancelPayload {
  account: string;
  order: string;
}
