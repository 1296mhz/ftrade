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
  symbolSelected: '',
  loadingText: 'Loading',
  errorText: 'Error loading',
  loadingSymbols: false,
  errorSymbols: false,
  loadingOhlc: false,
  errorOhlc: false,
  currentSymbol: {
    ticker: '',
    currency: '',
    exchange: '',
    minIncrement: 0,
    minIncrementAmount: 0,
    type: '',
    bid: 0,
    ask: 0,
    ohlcNavigator: {
      data: [],
      begin: 0,
      end: 0,
      interval: 'd',
    },
    ohlc: {
      data: [],
      begin: 0,
      end: 0,
      interval: 'd',
    },
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
