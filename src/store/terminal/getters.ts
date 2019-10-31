import Vue from 'vue';
import { TerminalState } from './types';
import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';

export const getters: GetterTree<TerminalState, RootState> = {
  TICKERS(state: TerminalState): any {
    return state.tickers;
  },
  SYMBOLS(state: TerminalState): any {
    return state.symbols;
  },
  POSITIONS(state: TerminalState): any {
    return state.positions;
  },
  ORDERS(state: TerminalState): any {
    return state.orders;
  },
  SERIES(state: TerminalState): any {
    return state.stockOptions.series[0].data;
  },
};
