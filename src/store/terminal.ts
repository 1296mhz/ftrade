import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, ITerminalState, ISymbol } from './types';
import { CREATE_SYMBOL } from './terminal/mutation-types';

const terminal: Module<ITerminalState, IMainState> = {

  // State
  state: {
    account: '',
    symbols: [],
  },

  // Mutations
  mutations:  {
    SetSymbols(state, symbols: ISymbol[]) {
      state.symbols = symbols;
    },
  },

  // Actions
  actions: {
    // Request user symbols
    async GetSymbols({commit}) {
      const resp = await Vue.$cf.RPC({ method: 'GetSymbols' });
      commit('SetSymbols', resp.data);
    },

    // Add symbol to user
    async CreateSymbol({commit}, ticker: string) {
      const resp = await Vue.$cf.RPC({ method: 'CreateSymbol', params: { ticker: ticker } });
    },


  },

};

export default terminal;
