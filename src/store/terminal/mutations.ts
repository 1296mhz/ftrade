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
  SET_SYMBOL_BID,
  SET_SYMBOL_ASK,
} from './mutation-types';
import { state } from '../app';

interface IDeleteSymbol {
  Command: string;
  Params: string;
}

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
  [DELETE_SYMBOL](state: TerminalState, data: IDeleteSymbol) {
    console.log("delete symbols ", data)
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
    if (data !== undefined) {
      const { ticker, currency, exchange, minIncrement, minIncrementAmount, type } = data;
      const newState = {
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
        ticker: ticker,
        currency: currency,
        exchange: exchange,
        minIncrement: minIncrement,
        minIncrementAmount: minIncrementAmount,
        type: type,
      };
      Vue.set(
        state,
        'currentSymbol',
        newState,
      );
    }

  },
  [SET_SYMBOL_BID](state: TerminalState, data: any) {
    const newStateSymbols = [...state.symbols];
    Vue.set(
      state,
      'symbols',
      newStateSymbols.map((symbol) => {
        if (symbol.ticker === data.data.ticker) {
          symbol.bid = data.data.bid;
        }
        return symbol;
      }),
    );
  },
  [SET_SYMBOL_ASK](state: TerminalState, data: any) {
    const newStateSymbols = [...state.symbols];
    Vue.set(
      state,
      'symbols',
      newStateSymbols.map((symbol) => {
        if (symbol.ticker === data.data.ticker) {
          symbol.ask = data.data.ask;
        }
        return symbol;
      }),
    );
  },

};
