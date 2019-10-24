import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import AppModule, { state as AppState } from './app';
import AuthModule, { state as AuthState } from './auth';
import TerminalModule, { state as TerminalState } from './terminal';

Vue.use(Vuex);

const options: StoreOptions<RootState> = {
  state: {
    app: AppState,
    auth: AuthState,
    terminal: TerminalState,
  },
  modules: {
    app: AppModule,
    auth: AuthModule,
    terminal: TerminalModule,
  },
  plugins: [
  ],
};

export default new Vuex.Store<RootState>(options);
