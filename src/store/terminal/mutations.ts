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
} from './mutation-types';

export const mutations: MutationTree<TerminalState> = {
  [SET_TICKERS](state: TerminalState, data: any) {
    Vue.set(state, 'tickers', data);
  },
  [SET_OHLC](state: TerminalState, data: any) {
    Vue.set(state, 'currentSymbol', data);
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
    const  { ticker, currency, exchange, minIncrement, minIncrementAmount, type } = data[0];
    console.log("dta", data[0])
    const newState = { 
      ...state.currentSymbol,
      ticker: ticker,
      currency: currency,
      exchange: exchange,
      minIncrement: minIncrement,
      minIncrementAmount: minIncrementAmount,
      type: type 
    };
    console.log("newState ", newState)
    Vue.set(
      state,
      'currentSymbol',
      newState,
    );
  },
};
