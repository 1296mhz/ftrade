import Vue from 'vue';
import { TerminalState } from './types';
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
} from './mutation-types';

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
  async orders({ commit, state }) {
    const orders = [
      {
        id: '0001',
        state: 'open',
        ticker: 'EUR/USD.E.FX',
        type: 'limit',
        side: 'buy',
        quantity: 10,
        time: new Date(2017, 4, 4, 17, 23, 42, 11).toLocaleString(),
      },
    ];
    commit(SET_ORDERS, orders);
  },
  async createSymbol({ commit, state }, ticker) {
    commit(SET_LOADING_SYMBOLS, true);
    const s = await Vue.$centrifuge.createSymbol(ticker);
    commit(SET_LOADING_SYMBOLS, false);
  },
  async deleteSymbol({ commit, state }, ticker) {
    commit(SET_LOADING_SYMBOLS, true);
    await Vue.$centrifuge.deleteSymbol(ticker);
    commit(SET_LOADING_SYMBOLS, false);
  },
  async ohlc({ commit, state }, params) {
    const begin = params.begin ? params.begin : 0;
    const end = params.end ? params.end : Vue.$constants.END_DATE_OHLC();
    const delta = (Math.round(end) - Math.round(begin)) / 1000;
    let interval = 'd';
    (delta <= 3600) ? interval = 's' : interval = 'd';
    (delta > 3600 && delta <= 60000) ? interval = 'm' : interval = 'd';
    (delta > 60000 && delta <= 3600000) ? interval = 'h' : interval = 'd';
    (delta > 3600000 && delta <= 86400000) ? interval = 'd' : interval = 'd';
    (delta > 604800000 && delta <= 2592000000.000001) ? interval = 'M' : interval = 'd';
    (delta > 2592000000.000001 && delta <= 31536000000.428898) ? interval = 'y' : interval = 'd';
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

  async ohlcNavigator({ commit, state }, params) {
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

  setSymbolSelected({ commit, state }, params) {
    commit(SET_SYMBOL_SELECTED, params);
  },
};
