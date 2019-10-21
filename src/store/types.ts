import { AppState} from './app/types';
import { TerminalState } from './terminal/types';

export interface RootState {
  app: AppState;
  terminal: TerminalState;
}
