import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, ITerminalState, ISymbol, IOrder, ITrade } from './types';

const terminal: Module<ITerminalState, IMainState> = {

  // State
  state: {
    symbols: [],

    account: '',
    orders: [],
    trades: [],
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

    // Set current account
    SetAccount(state, account: string) {
      state.account = account;
    },

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

    // Update orders list
    SetAccountOrders(state, orders: IOrder[]) {
      state.orders = orders;
    },

    // Update order data
    SetOrder(state, data: IOrder) {
      const order = state.orders.find((order) => order.id === data.id);
      if (order) {
        order.state = data.state;
        order.leaves = data.leaves;
        order.time = data.time;
      } else {
        state.orders.push(data);
      }
    },

    // Update trades list
    SetAccountTrades(state, trades: ITrade[]) {
      state.trades = trades;
    },

    // Add new trade
    CreateTrade(state, trade: ITrade) {
      state.trades.push(trade);
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
    SubscribeSymbols({state, commit, rootState}) {
      // Subscribe symbols list update
      Vue.$cf.Subscribe(`symbols#${rootState.userId}`, ({data}) => {
        let symbols = state.symbols;
        if (data.command === 'create') {
          symbols.push(data.params);
          commit('SetSymbols', symbols);
        } else
        if (data.command === 'delete') {
          symbols = symbols.filter((symbol) => symbol.ticker !== data.params);
          commit('SetSymbols', symbols);
        }
      });

      // Subscribe price update
      state.symbols.forEach((symbol) => {
        Vue.$cf.Subscribe(`symbols:${symbol.ticker}`, ({data}) => {
          data.ticker = symbol.ticker;
          commit('SetSymbol', data);
        });
      });
    },

    // Unsubscribe from symbols updates
    UnsubscribeSymbols({state, rootState}) {
      // Unsubscribe from price updates
      state.symbols.forEach((symbol) => {
        Vue.$cf.Unsubscribe(`symbols:${symbol.ticker}`);
      });

      // Unsubscribe from symbols list updates
      Vue.$cf.Unsubscribe(`symbols#${rootState.userId}`);
    },

    // Set current account
    // request account orders and trades
    // and subscribe to updates
    async SetAccount({state, dispatch, commit}, account: string) {
      if (state.account) {
        // Unsubscribe from updates
        await dispatch('UnsubscribeAccountOrders');
        await dispatch('UnsubscribeAccountTrades');
      }

      commit('SetAccount', account);

      // Orders
      await dispatch('GetAccountOrders', account);
      await dispatch('SubscribeAccountOrders');
      // Trades
      await dispatch('GetAccountTrades', account);
      await dispatch('SubscribeAccountTrades');
    },

    // Request account orders
    async GetAccountOrders({commit}, account: string) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetAccountOrders', params: { account: account } });
        commit('SetAccountOrders', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Subscribe to orders updates
    // current account used
    SubscribeAccountOrders({state, commit, rootState}) {
      // Subscribe symbols list update
      Vue.$cf.Subscribe(`orders:${state.account}#${rootState.userId}`, ({data}) => {
        if (data.command === 'update') {
          commit('SetOrder', data.params);
        }
      });
    },

    // Unsubscribe from orders updates
    // current account used
    UnsubscribeAccountOrders({state, rootState}) {
      Vue.$cf.Unsubscribe(`orders:${state.account}#${rootState.userId}`);
    },

    // Request account trades
    async GetAccountTrades({commit}, account: string) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetAccountTrades', params: { account: account } });
        commit('SetAccountTrades', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Subscribe to trades updates
    // current account used
    SubscribeAccountTrades({state, commit, rootState}) {
      // Subscribe symbols list update
      Vue.$cf.Subscribe(`trades:${state.account}#${rootState.userId}`, ({data}) => {
        if (data.command === 'create') {
          commit('CreateTrade', data.params);
        }
      });
    },

    // Unsubscribe from orders updates
    // current account used
    UnsubscribeAccountTrades({state, rootState}) {
      Vue.$cf.Unsubscribe(`trades:${state.account}#${rootState.userId}`);
    },

    // Send new order
    async SendOrder({commit}, order: IOrder) {
      try {
        const data = await Vue.$cf.RPC({ method: 'SendOrder', params: order });
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },



  },



};

export default terminal;
