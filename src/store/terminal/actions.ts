import Vue from 'vue';
import { TerminalState, ISendOrder, ICancelOrder } from './types';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
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
  SET_TRADES,
  SET_UPDATE_TRADES,
  SET_UPDATE_ORDERS,
} from './mutation-types';
import { state } from '.';
import { map } from 'highcharts';

export const actions: ActionTree<TerminalState, RootState> = {
  async tickers({ commit, state }) {
    commit(SET_TICKERS, ['AAPL.NASDAQ', 'AMZN.NASDAQ', 'GOOG.NASDAQ', 'EUR/USD.E.FX', 'USD/JPY.E.FX', 'GBP/USD.E.FX']);
  },
  async deleteSymbolInStorage({ commit, state }, params) {
    commit(DELETE_SYMBOL, params);
  },
  async createSymbolInStorage({ commit, state }, params) {
    commit(CREATE_SYMBOL, params);
  },
  // Returns an array of SYMBOLS
  async symbols({ commit, state }) {
    commit(SET_LOADING_SYMBOLS, true);
    const s = await Vue.$centrifuge.getSymbols();
    commit(SET_SYMBOLS, s);
    commit(SET_LOADING_SYMBOLS, false);
  },
  async positions({ commit, state }) {
    const positions = [];
    const tickers = [...state.tickers];
    for (let i = 0; i < 100; ++i) {
      positions[i] = {
        id: i,
        ticker: tickers[Math.floor(Math.random() * tickers.length)],
        position: Math.floor(Math.random() * 100) + 1,
        avgprice: (Math.random() * 100 + 10).toFixed(2),
        price: (Math.random() * 100 + 10).toFixed(2),
        pnl: (Math.random() * 100 + 10).toFixed(2),
      };
    }
    commit(SET_POSITIONS, positions);
  },
  async orders({ commit, state }, account: string): Promise<any> {
    const orders = await Vue.$centrifuge.getAccountOrders(account);
    commit(SET_ORDERS, orders);
  },
  async sendOrder({ commit, state }, order: ISendOrder): Promise<any> {
    const orders = await Vue.$centrifuge.sendOrder(order);
  },
  async cancelOrder({ commit, state }, params: ICancelOrder): Promise<any> {
    const reponse = await Vue.$centrifuge.cancelOrder(params);
  },
  async trades({ commit, state }, accountId: string): Promise<any> {
    const trades = await Vue.$centrifuge.getAccountTrades(accountId);
    commit(SET_TRADES, trades);
  },
  async createSymbol({ commit, state }, ticker): Promise<any> {
    commit(SET_LOADING_SYMBOLS, true);
    const s = await Vue.$centrifuge.createSymbol(ticker);
    commit(SET_LOADING_SYMBOLS, false);
  },
  async deleteSymbol({ commit, state }, ticker): Promise<any> {
    commit(SET_LOADING_SYMBOLS, true);
    await Vue.$centrifuge.deleteSymbol(ticker);
    commit(SET_LOADING_SYMBOLS, false);
  },
  async setBidSymbol({ commit, state }, data): Promise<any> {
    commit(SET_SYMBOL_BID, data);
  },
  async setAskSymbol({ commit, state }, data): Promise<any> {
    commit(SET_SYMBOL_ASK, data);
  },
  async setUpdateTrades({ commit, state }, data): Promise<any> {
    commit(SET_UPDATE_TRADES, data);
  },
  async setUpdateOrders({ commit, state }, data): Promise<any> {
    let orders = [];
    switch (data.Command) {
      case 'update':
        orders = Vue.$_.map(state.orders, (order) => {
          return (order.id === data.Params.id) ? data.Params : order;
        });
    }
    commit(SET_UPDATE_ORDERS, orders);
  },
  async ohlc({ commit, state }, params): Promise<any> {
    const begin = params.begin ? params.begin : 0;
    const end = params.end ? params.end : Vue.$constants.END_DATE_OHLC();
    const delta = end - begin;
    let interval = 'd';

    if (delta < 216000000) {
      interval = 'm';
    } else if (delta < 4320000000) {
      interval = 'h';
    }

    Vue.$log.debug(params);

    params.interval = interval;
    params.begin = begin;
    params.end = end;
    const ohlc = await Vue.$centrifuge.getOhlc(params);

    const currentOhlc = {
      data: ohlc.data,
      begin: begin,
      end: end,
      interval: interval,
    };

    commit(SET_OHLC, currentOhlc);
  },

  async ohlcNavigator({ commit, state }, params): Promise<any> {
    const begin = params.begin ? params.begin : 0;
    const end = params.end ? params.end : Vue.$constants.END_DATE_OHLC();
    const interval = 'd';

    Vue.$log.debug(params);

    params.interval = interval;
    params.begin = begin;
    params.end = end;
    const ohlc = await Vue.$centrifuge.getOhlc(params);

    const navigatorOhlc = {
      data: ohlc.data,
      begin: begin,
      end: end,
      interval: interval,
    };

    commit(SET_OHLC_NAVIGATOR, navigatorOhlc);
  },
  setSymbolSelected({ commit, state }, params): void {
    commit(SET_SYMBOL_SELECTED, params);
  },
};
