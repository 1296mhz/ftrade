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
} from './mutation-types';

export const actions: ActionTree<TerminalState, RootState> = {
  afterSetExtremes({ commit, state }, band) {
    return 'hello';
  },
  async tickers({ commit, state }) {
    commit(SET_TICKERS, ['AAPL.NASDAQ', 'AMZN.NASDAQ', 'GOOG.NASDAQ', 'EUR/USD.E.FX', 'USD/JPY.E.FX', 'GBP/USD.E.FX']);
  },
  async deleteSymbolInStorage({ commit, state }, params) {
    commit(DELETE_SYMBOL, params);
  },
  async createSymbolInStorage({ commit, state }, params) {
    commit(CREATE_SYMBOL, params);
  },
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
  async getOhlc({ commit, state }, params) {
    Vue.$log.debug(`params: ${JSON.stringify(params)}`);
    const ohlc = await Vue.$centrifuge.getOhlc(params);
    commit(SET_OHLC, ohlc);
  },
  setSymbolSelected({ commit, state }, params) {
    commit(SET_SYMBOL_SELECTED, params);
  },
};
