import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, IStrategyParams, IInstrument, ITrade, IOrder} from './types';
import uuid from 'uuid/v4';

export interface IStrategyState {
  portfolios: IPortfolio[];
  portfolio: IPortfolio;
  orders: IOrder[];
  trades: ITrade[];
  strategy: IStrategyLive;
}

export interface IStrategyLive {
  id: string;
  name: string;
  source: string;
  scriptId: string;
  portfolioId: string;
  instruments: IInstrument[];
  params: IStrategyParams[];
  status: string;
}


export interface IPortfolio {
  id: string;
  name: string;
  strategies: IStrategyLive[];
}


const strategy: Module<IStrategyState, IMainState> = {

  namespaced: true,
  // State
  state: {
    portfolios: [],
    portfolio: {
      id: '',
      name: '',
      strategies: [],
    },
    strategy: {
      id: '',
      name: '',
      portfolioId: '',
      scriptId: '',
      source: '',
      instruments: [],
      params: [],
      status: '',
    },
    orders: [],
    trades: [],
  },

  // Mutations
  mutations:  {
    // Create new portfolio
    CreatePortfolio(state, portfolio: IPortfolio) {
      state.portfolios.push(portfolio);
    },
    // Create new strategy
    CreateStrategy(state, strategy: IStrategyLive) {
      state.portfolio.strategies.push(strategy);
    },
    // Update current category
    SetCurrentPortfolio(state, portfolio: IPortfolio) {
       Vue.set(state, 'portfolio', portfolio);
    },
    SetCurrentStrategy(state, strategy: IStrategyLive) {
     // console.log("strategy ", strategy)
       Vue.set(state, 'strategy', strategy);
    },
    SetPortfolios(state, portfolios: IPortfolio[]) {
      Vue.set(state, 'portfolios', portfolios);
    },
  },
  // Actions
  actions: {
    CreatePortfolio({state, commit}) {
      const uid = uuid();
      const newPortfolio = {
        id: uid,
        name: 'P-' + uid,
        strategies: [],
      };
      commit('CreatePortfolio', newPortfolio);
    },
    CreateStrategy({state, commit}, scriptId) {
      const uid = uuid();
      const strategy = {
        id: uid,
        name: 'S-' + uid,
        portfolioId: state.portfolio.id,
        scriptId: scriptId,
        status: 'stop',
        params: [
          {
            key: 'foo',
            value: uid,
          },
          {
            key: 'bar',
            value: 'SomeValue',
          },
        ],
      };
      commit('CreateStrategy', strategy);
    },
    DeleteStrategy({state, commit}) {
      if (state.strategy.id) {
        const cportfolio = state.portfolios.filter((portfolio) => portfolio.id === state.portfolio.id);
        const strategies = cportfolio[0].strategies.filter((strategy) => strategy.id !== state.strategy.id);
        cportfolio[0].strategies = strategies;
        const portfolios = state.portfolios.map((portfolio) => {
          return portfolio.id === state.portfolio.id ? portfolio = cportfolio[0] : portfolio; });
        commit('SetPortfolios', portfolios);
      } else {
        const result = state.portfolios.filter((portfolio) => portfolio.id !== state.portfolio.id);
        commit('SetPortfolios', result);
        commit('SetCurrentPortfolio', {
          id: '',
          name: '',
          strategies: [],
        });
      }
    },
    ChangeStatus({state, commit}) {
        const cportfolio = state.portfolios.filter((portfolio) => portfolio.id === state.portfolio.id);
        const strategies = cportfolio[0].strategies.filter((strategy) => strategy.id === state.strategy.id);
        strategies[0].status = strategies[0].status === 'stop' || strategies[0].status === 'error' ? 'run' : 'stop';
        const portfolios = state.portfolios.map(
          (portfolio) => {
            return portfolio.id === state.portfolio.id ? portfolio = cportfolio[0] : portfolio;
          });
        commit('SetPortfolios', portfolios);
    },
  },
};

export default strategy;
