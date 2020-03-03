import Vue from 'vue';
import uuid from 'uuid/v4';
import { Module } from 'vuex';
import { IMainState, IStrategyParams, IInstrument, ITrade, IOrder} from './types';

// Strategies state interface
export interface IStrategiesState {
  portfolios: IPortfolio[];
  portfolio: IPortfolio;
  orders: IOrder[];
  trades: ITrade[];
  strategy: IStrategyLive;
}

// Portfolio
export interface IPortfolio {
  id: string;
  name: string;
  strategies: IStrategyLive[];
}

export interface IStrategyLive {
  id: string;
  name: string;
  source: string;
  portfolio: string;
  instruments: IInstrument[];
  params: IStrategyParams[];
  state: string;
}

// Strategies storage module
const strategies: Module<IStrategiesState, IMainState> = {

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
      portfolio: '',
      source: '',
      instruments: [],
      params: [],
      state: '',
    },

    orders: [],
    trades: [],
  },

  // Getters
  getters: {
    // Find unique portfolio name
    newPortfolioName: (state) => {
      let name: string;
      let idx = 0;
      do {
        ++idx;
        name = 'Portfolio ' + idx.toString();
      } while (state.portfolios.some((p) => p.name === name));
      return name;
    },
    // Find unique strategy name
    newStrategyName: (state) => {
      let name: string;
      let idx = 0;
      do {
        ++idx;
        name = 'Strategy ' + idx.toString();
      } while (state.portfolios.some((p) => p.strategies.some((s) => s.name === name)));
      return name;
    },
  },


  // Mutations
  mutations:  {
    // Portfolios
    SetPortfolios(state,  portfolios: IPortfolio[]) {
      state.portfolios = portfolios;
    },
    CreatePortfolio(state, portfolio: IPortfolio) {
      state.portfolios.push(portfolio);
    },
    DeletePortfolio(state, id: string) {
      state.portfolios = state.portfolios.filter((p) => p.id !== id);
    },
    SetPortfolio(state, portfolio: IPortfolio) {
      state.portfolio = portfolio;
      state.strategy.id = '';
    },

    // Strategies
    SetStrategy(state, strategy: IStrategyLive) {
      state.strategy = strategy;
      state.portfolio.id = '';
    },
    CreateStrategy(state, strategy: IStrategyLive) {
      const portfolio: IPortfolio =  state.portfolios.find((p) => p.id === strategy.portfolio);
      if (portfolio) {
        portfolio.strategies.push(strategy);
      }
    },
    DeleteStrategy(state, id: string) {
      state.portfolios.forEach((p) => {
        p.strategies = p.strategies.filter((s) => s.id !== id);
      });
    },

  },
  // Actions
  actions: {
    // Request user portfolios
    async GetPortfolios({commit}) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetPortfolios'});
        commit('SetPortfolios', data.portfolios);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Create strategy portfolio
    async CreatePortfolio({commit, getters}) {
      try {
        await Vue.$cf.RPC({ method: 'CreatePortfolio', params: {
          id: uuid(),
          name: getters.newPortfolioName,
        }});
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Delete strategies portfolio
    async DeletePortfolio({state, commit}) {
      try {
        if (state.portfolio.id) {
          await Vue.$cf.RPC({ method: 'DeletePortfolio', params: {id: state.portfolio.id}});
        }
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Subscribe to strategies updates
    SubscribeStrategies({commit, rootState: {userId}}) {
      Vue.$cf.Subscribe(`portfolios#${userId}`, ({data}) => {
        if (data.command === 'create') {
          commit('CreatePortfolio', {...data.params, strategies: []});
        } else
        if (data.command === 'delete') {
          commit('DeletePortfolio', data.params.id);
        }
      });

      Vue.$cf.Subscribe(`strategies#${userId}`, ({data}) => {
        if (data.command === 'create') {
          commit('CreateStrategy', data.params);
        } else
        if (data.command === 'delete') {
          commit('DeleteStrategy', data.params.id);
        } else
        if (data.command === 'update') {
          // commit('UpdateStrategy', data.params);
        }
      });
    },

    // Unsubscribe from strategies updates
    UnsubscribeStrategies({rootState: {userId}}) {
      Vue.$cf.Unsubscribe(`portfolios#${userId}`);
      Vue.$cf.Unsubscribe(`strategies#${userId}`);
    },

    // Request strategy data by id
    async GetStrategy({commit}, id: string) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetStrategy', params: {id: id}});
        commit('SetStrategy', data);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Create strategy
    async CreateStrategy({getters, state, commit}, scriptId) {
      try {
        await Vue.$cf.RPC({ method: 'CreateStrategy', params: {
          strategy: {
            id: uuid(),
            name: getters.newStrategyName,
            portfolio: state.portfolio.id,
          },
          scriptId: scriptId,
        }});
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Delete strategy
    async DeleteStrategy({state, commit}) {
      try {
        if (state.strategy.id) {
          await Vue.$cf.RPC({ method: 'DeleteStrategy', params: {id: state.strategy.id}});
        }
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    ChangeStatus({state, commit}) {
        const cportfolio = state.portfolios.filter((portfolio) => portfolio.id === state.portfolio.id);
        const strategies = cportfolio[0].strategies.filter((strategy) => strategy.id === state.strategy.id);
        strategies[0].state = strategies[0].state === 'stop' || strategies[0].state === 'error' ? 'run' : 'stop';
        const portfolios = state.portfolios.map(
          (portfolio) => {
            return portfolio.id === state.portfolio.id ? portfolio = cportfolio[0] : portfolio;
          });
        commit('SetPortfolios', portfolios);
    },
  },
};

export default strategies;
