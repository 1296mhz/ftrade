import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, IVAccount, ISymbol, IOrder, ITrade } from './types';

// Terminal state interface
interface ITerminalState {
  vaccounts: IVAccount[];
  vaccount: string;
  symbols: ISymbol[];
  orders: IOrder[];
  trades: ITrade[];
}

// Cancel order action payload
export interface ICancelPayload {
  account: string;
  order: string;
}

// Get ohlc data action payload
export interface IOhlcPayload {
  ticker: string;
  interval: string;
  begin: number;
  end: number;
}

const terminal: Module<ITerminalState, IMainState> = {

  namespaced: true,

  // State
  state: {
    vaccounts: [],
    vaccount: '',

    symbols: [],
    orders: [],
    trades: [],
  },

  // Mutations
  mutations:  {

    // Set virtual accounts
    SetVAccounts(state, accounts: IVAccount[]) {
      state.vaccounts = accounts;
    },

    // Set current account
    SetVAccount(state, account: string) {
      state.vaccount = account;
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
    SetOrders(state, orders: IOrder[]) {
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
    SetTrades(state, trades: ITrade[]) {
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
        commit('SetError', error, {root: true});
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
        commit('SetError', error, {root: true});
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
        commit('SetError', error, {root: true});
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

    // Request user virtual accounts
    async GetVAccounts({commit}) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetVAccounts' });
        commit('SetVAccounts', data);
      } catch (error) {
        commit('SetError', error, {root: true});
      }
    },

    // Set current account
    // request account orders and trades
    // and subscribe to updates
    async SetVAccount({state, dispatch, commit}, account: string) {
      if (state.vaccount) {
        // Unsubscribe from updates
        await dispatch('UnsubscribeAccountOrders');
        await dispatch('UnsubscribeAccountTrades');
      }

      commit('SetVAccount', account);

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
        const data = await Vue.$cf.RPC({ method: 'GetVAccountOrders', params: { account: account } });
        commit('SetOrders', data);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Subscribe to orders updates
    // current account used
    SubscribeAccountOrders({state, commit, rootState}) {
      // Subscribe symbols list update
      Vue.$cf.Subscribe(`orders:${state.vaccount}#${rootState.userId}`, ({data}) => {
        if (data.command === 'update') {
          commit('SetOrder', data.params);
        }
      });
    },

    // Unsubscribe from orders updates
    // current account used
    UnsubscribeAccountOrders({state, rootState}) {
      Vue.$cf.Unsubscribe(`orders:${state.vaccount}#${rootState.userId}`);
    },

    // Request account trades
    async GetAccountTrades({commit}, account: string) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetVAccountTrades', params: { account: account } });
        commit('SetTrades', data);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Subscribe to trades updates
    // current account used
    SubscribeAccountTrades({state, commit, rootState}) {
      // Subscribe symbols list update
      Vue.$cf.Subscribe(`trades:${state.vaccount}#${rootState.userId}`, ({data}) => {
        if (data.command === 'create') {
          commit('CreateTrade', data.params);
        }
      });
    },

    // Unsubscribe from orders updates
    // current account used
    UnsubscribeAccountTrades({state, rootState}) {
      Vue.$cf.Unsubscribe(`trades:${state.vaccount}#${rootState.userId}`);
    },


    // Send new order
    async SendOrder({commit}, order: IOrder) {
      try {
        await Vue.$cf.RPC({ method: 'SendOrder', params: order });
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Send new order
    async CancelOrder({commit}, payload: ICancelPayload) {
      try {
        await Vue.$cf.RPC({ method: 'CancelOrder', params: payload });
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Get OHLC data
    async GetOhlc({commit}, payload: IOhlcPayload) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetOhlc', params: payload });
        return data;
      } catch (error) {
        commit('SetError', error, {root: true});
        return [];
      }
    },
  },
};

export default terminal;
