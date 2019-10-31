import { AppState} from './app/types';
import { IAuthState} from './auth/types';
import { TerminalState } from './terminal/types';

export interface RootState {
  app: AppState;
  auth: IAuthState;
  terminal: TerminalState;
}
