import { TerminalState } from './types';
import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';

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
    return state.currentSymbol.ohlc.data;
  },
  OHLC_NAVIGATOR(state: TerminalState): any {
    return state.currentSymbol.ohlcNavigator.data;
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
  TRADES(state: TerminalState): any {
    return state.trades;
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
    };
  },
  CURRENT_SYMBOL(state: TerminalState): any {
    return state.currentSymbol;
  },
};
