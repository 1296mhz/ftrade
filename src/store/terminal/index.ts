import { TerminalState } from './types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { Module } from 'vuex';
import { RootState } from '@/store/types';

const namespaced: boolean = true;

export const state: TerminalState = {
  tickers: [],
  positions: [],
  symbols: [],
  orders: [],
  ohlc: [],
  symbolSelected: '',
  loadingText: 'Loading',
  errorText: "Error loading",
  loadingSymbols: false,
  errorSymbols: false,
  loadingOhlc: false,
  errorOhlc: false,
  currentOhlc: {
    ticker: '',
    min: 0,
    max: 0,
    type: 'd',
  },
};

const terminalModule: Module<TerminalState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};

export default terminalModule;
export const namespace = 'terminal';
