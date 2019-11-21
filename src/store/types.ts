import { AppState} from './app/types';
import { IAuthState} from './auth/types';
import { TerminalState } from './terminal/types';

// Main state interface
export interface IMainState {
  connected: boolean;
  error: string;
  userId: string;

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
