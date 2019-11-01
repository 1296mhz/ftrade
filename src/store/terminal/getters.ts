import Vue from 'vue';
import { TerminalState } from './types';
import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';
import { state } from '../app';

export const getters: GetterTree<TerminalState, RootState> = {
  LOADING_TEXT(state: TerminalState): any {
    return state.loadingText;
  },
  ERRROR_TEXT(state: TerminalState): any {
    return state.errorText;
  },
  TICKERS(state: TerminalState): any {
    return state.tickers;
  },
  OHLC(state: TerminalState): any {
    return state.currentSymbol;
  },
  SYMBOLS(state: TerminalState): any {
    return state.symbols;
  },
  POSITIONS(state: TerminalState): any {
    return state.positions;
  },
  ORDERS(state: TerminalState): any {
    return state.orders;
  },
  LOADING_SYMBOLS(state: TerminalState): any {
    return state.loadingSymbols;
  },
  ERROR_SYMBOLS(state: TerminalState): any {
    return state.errorSymbols;
  },
  LOADING_OHLC(state: TerminalState): any {
    return state.loadingOhlc;
  },
  ERROR_OHLC(state: TerminalState): any {
    return state.errorOhlc;
  },
  SYMBOL_SELECTED(state: TerminalState): any {
    const { currentSymbol: { ticker, currency, exchange, minIncrement, minIncrementAmount, type } } = state;
    return {
      ticker: ticker,
      currency: currency,
      exchange: exchange,
      minIncrement: minIncrement,
      minIncrementAmount: minIncrementAmount,
      type: type,
    }
  }
};
