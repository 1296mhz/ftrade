import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, ITerminalState, ISymbol } from './types';

const terminal: Module<ITerminalState, IMainState> = {

  // State
  state: {
    account: '',
    symbols: [],
  },

  // Getters
  getters: {
    // TODO just return symbols???
    symbols: (state) => {
      return state.symbols.map((symbol) => {
        return {
          ticker: symbol.ticker,
          bid: symbol.bid,
          ask: symbol.ask };
      });
    },
  },

  // Mutations
  mutations:  {
    // Update symbols list
    SetSymbols(state, symbols: ISymbol[]) {
      state.symbols = symbols;
    },

    // Update symbol data
    SetSymbol(state, data: any) {
      const symbol = state.symbols.find((symbol) => symbol.ticker === data.ticker);
      if (symbol) {
        if (data.bid) {
          Vue.set(symbol, 'bid', data.bid);
        }
        if (data.ask) {
          Vue.set(symbol, 'ask', data.ask);
        }
      }
    },
  },

  // Actions
  actions: {

    // Request user symbols
    async GetSymbols({commit}) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetSymbols' });
        commit('SetSymbols', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Add symbol to user
    async CreateSymbol({commit}, ticker: string) {
      try {
        await Vue.$cf.RPC({ method: 'CreateSymbol', params: { ticker: ticker } });
        // Subscribe to updates
        Vue.$cf.Subscribe(`symbols:${ticker}`, ({data}) => {
          data.ticker = ticker;
          commit('SetSymbol', data);
        });
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Delete symbol from user
    async DeleteSymbol({commit}, ticker: string) {
      try {
        await Vue.$cf.RPC({ method: 'DeleteSymbol', params: ticker });
        // Unsubscribe from updates
        Vue.$cf.Unsubscribe(`symbols:${ticker}`);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Subscribe to symbols updates
    SubscribeSymbols(ctx) {
      // Subscribe symbols list update
      Vue.$cf.Subscribe(`symbols#${this.state.userId}`, ({data}) => {
        let symbols = ctx.state.symbols;
        if (data.command === 'create') {
          symbols.push(data.params);
          ctx.commit('SetSymbols', symbols);
        } else
        if (data.command === 'delete') {
          symbols = symbols.filter((symbol) => symbol.ticker !== data.params);
          ctx.commit('SetSymbols', symbols);
        }
      });

      // Subscribe price update
      ctx.state.symbols.forEach((symbol) => {
        Vue.$cf.Subscribe(`symbols:${symbol.ticker}`, ({data}) => {
          data.ticker = symbol.ticker;
          ctx.commit('SetSymbol', data);
        });
      });
    },

    // Unsubscribe from symbols updates
    UnsubscribeSymbols(ctx) {
      // Unsubscribe from price updates
      ctx.state.symbols.forEach((symbol) => {
        Vue.$cf.Unsubscribe(`symbols:${symbol.ticker}`);
      });

      // Unsubscribe from symbols list updates
      Vue.$cf.Unsubscribe(`symbols#${this.state.userId}`);
    },

  },



};

export default terminal;
