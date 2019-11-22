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
  terminal: TerminalState;
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
  account: string;

  symbols: ISymbol[];
}

// Symbol
export interface ISymbol {
  ticker: string;
  type: string;
  currency: string;
  exchange: string;
  minIncrement: number;
  minIncrementAmount: number;
}
