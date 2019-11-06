import { MutationTree } from 'vuex';
import Vue from 'vue';
import { TerminalState } from './types';

import {
  SET_TICKERS,
  SET_SYMBOLS,
  SET_POSITIONS,
  SET_ORDERS,
  DELETE_SYMBOL,
  CREATE_SYMBOL,
  SET_OHLC,
  SET_LOADING_SYMBOLS,
  SET_SYMBOL_SELECTED,
  SET_OHLC_NAVIGATOR,
} from './mutation-types';

export const mutations: MutationTree<TerminalState> = {
  [SET_TICKERS](state: TerminalState, data: any) {
    Vue.set(state, 'tickers', data);
  },
  [SET_OHLC](state: TerminalState, data: any) {
    Vue.set(state.currentSymbol, 'ohlc', data);
  },
  [SET_OHLC_NAVIGATOR](state: TerminalState, data: any) {
    Vue.set(state.currentSymbol, 'ohlcNavigator', data);
  },
  [SET_SYMBOLS](state: TerminalState, data: any) {
    Vue.set(state, 'symbols', data);
  },
  [SET_POSITIONS](state: TerminalState, data: any) {
    Vue.set(state, 'positions', data);
  },
  [SET_ORDERS](state: TerminalState, data: any) {
    Vue.set(state, 'orders', data);
  },
  [DELETE_SYMBOL](state: TerminalState, data: any) {
    const newState = [...state.symbols];
    Vue.set(
      state,
      'symbols',
      Vue.$_.filter(newState, (symbol) => {
        return symbol.ticker !== data.Params;
      }),
    );
  },
  [CREATE_SYMBOL](state: TerminalState, data: any) {
    const newState = [...state.symbols, data.Params];
    Vue.set(
      state,
      'symbols',
      newState,
    );
  },
  [SET_LOADING_SYMBOLS](state: TerminalState, data: any) {
    Vue.set(
      state,
      'loadingSymbols',
      data,
    );
  },
  [SET_SYMBOL_SELECTED](state: TerminalState, data: any) {
    const  { ticker, currency, exchange, minIncrement, minIncrementAmount, type } = data;
    const newState = { 
      ...state.currentSymbol,
      ticker: ticker,
      currency: currency,
      exchange: exchange,
      minIncrement: minIncrement,
      minIncrementAmount: minIncrementAmount,
      type: type 
    };
    Vue.set(
      state,
      'currentSymbol',
      newState,
    );
  },
};
