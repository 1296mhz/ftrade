import { MutationTree } from "vuex";
import Vue from "vue";
import { TerminalState } from "./types";

import {
  SET_TICKERS,
  SET_SYMBOLS,
  SET_POSITIONS,
  SET_ORDERS,
  SET_SERIES,
  DELETE_SYMBOL,
  CREATE_SYMBOL
} from "./mutation-types";

export const mutations: MutationTree<TerminalState> = {
  [SET_TICKERS](state: TerminalState, data: any) {
    Vue.set(state, "tickers", data);
  },
  [SET_SYMBOLS](state: TerminalState, data: any) {
    Vue.set(state, "symbols", data);
  },
  [SET_POSITIONS](state: TerminalState, data: any) {
    Vue.set(state, "positions", data);
  },
  [SET_ORDERS](state: TerminalState, data: any) {
    Vue.set(state, "orders", data);
  },
  [SET_SERIES](state: TerminalState, data: any) {
    Vue.set(state.stockOptions, "series", data);
  },
  [DELETE_SYMBOL](state: TerminalState, data: any) {
    const newState = [...state.symbols];
    Vue.set(
      state,
      "symbols",
      Vue.$_.filter(newState, function(symbol) {
        return symbol.ticker !== data.Params;
      })
    );
  },
  [CREATE_SYMBOL](state: TerminalState, data: any) {
    const newState = [...state.symbols, data.Params];
    Vue.set(
      state,
      "symbols",
      newState
    );

  }
};
