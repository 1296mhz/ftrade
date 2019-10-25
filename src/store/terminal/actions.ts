import Vue from 'vue';
import { TerminalState } from './types';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import {
  SET_TICKERS,
  SET_SYMBOLS,
  SET_POSITIONS,
  SET_ORDERS,
  SET_SERIES,
  DELETE_SYMBOL,
} from './mutation-types';

export const actions: ActionTree<TerminalState, RootState> = {
  async tickers({ commit, state }) {
    commit(SET_TICKERS, ['AAPL.NASDAQ', 'AMZN.NASDAQ', 'GOOG.NASDAQ', 'EUR/USD.E.FX', 'USD/JPY.E.FX', 'GBP/USD.E.FX']);
  },
  async deleteSymbolInStorage({ commit, state }, params) {
    commit(DELETE_SYMBOL, params)
  },
  async symbols({ commit, state }) {
    const s = await Vue.$centrifuge.getSymbols();
    commit(SET_SYMBOLS, s);
/* тестовые данные коммитем в мутацию
    commit(SET_SYMBOLS, [
      {
        ticker: "EUR/USD.E.FX",
        color: "orange darken-1",
        bid: 1.104,
        ask: 1.105,
      },
    ]);
    */
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
        pnl: (Math.random() * 100 + 10).toFixed(2)
      };
    }
    commit(SET_POSITIONS, positions);
  },
  async orders({ commit, state }) {
    const orders = [
      {
        id: "0001",
        state: "open",
        ticker: "EUR/USD.E.FX",
        type: "limit",
        side: "buy",
        quantity: 10,
        time: new Date(2017, 4, 4, 17, 23, 42, 11).toLocaleString()
      }
    ]
    commit(SET_ORDERS, orders);
  },
  async createSymbol({ commit, state }, ticker) {
    const s = await Vue.$centrifuge.createSymbol(ticker);
  },
  async deleteSymbol({ commit, state }, ticker) {
    await Vue.$centrifuge.deleteSymbol(ticker);
  },
  async series({ commit, state }): Promise<any> {
    let dataOhlc: number[] = [];
    for(let i = 0; i < 50; i++) {
      dataOhlc[i] = Math.floor(Math.random() * 100) + 1;
    }
    const series = [
      {
        name: "AAPL",
        data: dataOhlc,
        pointStart: Date.UTC(2018, 1, 1),
        pointInterval: 1000 * 3600 * 24,
        tooltip: {
          valueDecimals: 2
        }
      }
    ];
    commit(SET_SERIES, series);
  }
};
