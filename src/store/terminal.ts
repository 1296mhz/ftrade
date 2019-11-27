import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, ITerminalState, ISymbol } from './types';

const subscriptions = {
  symbols: null,
};

const terminal: Module<ITerminalState, IMainState> = {

  // State
  state: {
    account: '',
    symbols: [],
  },

  // Getters
  getters: {
    symbols: (state) => {
      return state.symbols.map((symbol) => {
        return {
          ticker: symbol.ticker,
          bid: 0,
          ask: 0 };
      });
    },
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
    GetSymbols({commit}) {
      return Vue.$cf.RPC({ method: 'GetSymbols' }).then((data) => {
        commit('SetSymbols', data);
      }).catch((error) => {
        commit('SetError', error);
      });
    },

    // Add symbol to user
    async CreateSymbol({commit}, ticker: string) {
      try {
        await Vue.$cf.RPC({ method: 'CreateSymbol', params: { ticker: ticker } });
      } catch (error) {
        commit('SetError', error);
      }
    },

    // Delete symbol from user
    async DeleteSymbol({commit}, ticker: string) {
      try {
        await Vue.$cf.RPC({ method: 'DeleteSymbol', params: ticker });
      } catch (error) {
        commit('SetError', error);
      }
    },

    // Subscribe to symbols updates
    SubscribeSymbols(ctx) {
      if (!subscriptions.symbols) {
        subscriptions.symbols = Vue.$cf.Subscribe(`symbols#${this.state.userId}`, ({data}) => {
          if (data.command === 'create') {
            ctx.state.symbols.push(data.params);
            ctx.commit('SetSymbols', ctx.state.symbols);
          } else
          if (data.command === 'delete') {
            const tmp = ctx.state.symbols.filter((symbol) => symbol.ticker !== data.params);
            ctx.commit('SetSymbols', tmp);
          }
        });
      }
    },

    // Unsubscribe from symbols updates
    UnsubscribeSymbols() {
      if (subscriptions.symbols) {
        subscriptions.symbols.unsubscribe();
        subscriptions.symbols = null;
      }
    },

  },



};

export default terminal;
