import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import TerminalModule, { state as TerminalState } from './terminal';

Vue.use(Vuex);

const options: StoreOptions<RootState> = {
  state: {
    terminal: TerminalState,
  },
  modules: {
    terminal: TerminalModule,
  },
  plugins: [
  ],
};

export default new Vuex.Store<RootState>(options);
