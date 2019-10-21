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
} from './mutation-types';
import { seriesType } from 'highcharts';
/*
An asynchronous operation is performed here, the result of its execution is committed to a mutation.  
For the test, here we have fake data transferred to the mutation
*/
export const actions: ActionTree<TerminalState, RootState> = {
  async tickers({ commit, state }) {
    commit(SET_TICKERS, ['AAPL.NASDAQ', 'AMZN.NASDAQ', 'GOOG.NASDAQ', 'EUR/USD.E.FX', 'USD/JPY.E.FX', 'GBP/USD.E.FX']);
  },
  async symbols({ commit, state }) {
    commit(SET_SYMBOLS, [
      {
        ticker: "EUR/USD.E.FX",
        color: "orange darken-1",
        bid: 1.104,
        ask: 1.105,
      },
      {
        ticker: "USD/JPY.E.FX",
        color: "orange darken-1",
        bid: 108.34,
        ask: 108.36,
      },
      {
        ticker: "GBP/USD.E.FX",
        color: "orange darken-1",
        bid: 1.266,
        ask: 1.268,
      },
      {
        ticker: "AAPL.NASDAQ",
        color: "blue darken-1",
        bid: 233.12,
        ask: 233.15,
      },
      {
        ticker: "AMZN.NASDAQ",
        color: "blue darken-1",
        bid: 1742.5,
        ask: 1747.15,
      },
      {
        ticker: "GOOG.NASDAQ",
        color: "blue darken-1",
        bid: 1222.5,
        ask: 1225.0,
      },
      {
        ticker: "BTC.EXANTE",
        color: "purple  darken-1",
        bid: 8338,
        ask: 8400,
      },
      {
        ticker: "LTC.EXANTE",
        color: "purple  darken-1",
        bid: 56.5,
        ask: 57.5,
      },
      {
        ticker: "ETH.EXANTE",
        color: "purple  darken-1",
        bid: 183.3,
        ask: 184.5,
      }
    ]);
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
  async series({ commit, state }) {
    let dataOhlc: number[] = [];
    for(let i = 0; i < 50; i++) {
      dataOhlc[i] = Math.floor(Math.random() * 100) + 1;
    }
    console.log(dataOhlc)
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
