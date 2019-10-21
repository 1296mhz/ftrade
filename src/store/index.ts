import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import AppModule, { state as AppState } from './app';
import TerminalModule, { state as TerminalState } from './terminal';

Vue.use(Vuex);

const options: StoreOptions<RootState> = {
  state: {
    app: AppState,
    terminal: TerminalState,
  },
  modules: {
    app: AppModule,
    terminal: TerminalModule,
  },
  plugins: [
  ],
};

export default new Vuex.Store<RootState>(options);
