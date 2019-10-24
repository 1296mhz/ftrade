import { AppState} from './app/types';
import { AuthState} from './auth/types';
import { TerminalState } from './terminal/types';

export interface RootState {
  app: AppState;
  auth: AuthState,
  terminal: TerminalState;
}
