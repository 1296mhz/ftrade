import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState } from './types';

// Scripts state interface
export interface IScriptsState {
  categories: ICategory[];
}

// Category
export interface ICategory {
  name: string;
  scripts: IScript[];
}

// Script
export interface IScript {
  id: string;
  name: string;
  category: string;
  source: string;
}

// Scripts storage module
const scripts: Module<IScriptsState, IMainState> = {

  // State
  state: {
    categories: [],
  },

  // Mutations
  mutations:  {

    // Update categories tree
    SetCategories(state, categories: ICategory[]) {
      state.categories = categories;
    },

  },

  // Actions
  actions: {

    // Request user scripts
    async GetScripts({commit}) {
      try {
        const data = await Vue.$cf.RPC({ method: 'GetScripts' });
        commit('SetCategories', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Create user script
    async CreateScript({commit}, ticker: string) {
      try {
        await Vue.$cf.RPC({ method: 'CreateScript', params: { ticker: ticker } });
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Subscribe to scripts updates
    SubscribeScripts({state, commit, rootState}) {
      // Subscribe scripts tree update
      Vue.$cf.Subscribe(`scripts#${rootState.userId}`, ({data}) => {
        let categories = state.categories;
        if (data.command === 'create') {
          // symbols.push(data.params);
          // commit('SetScripts', categories);
        } else
        if (data.command === 'delete') {
          // symbols = symbols.filter((symbol) => symbol.ticker !== data.params);
          // commit('SetSymbols', symbols);
        }
      });
    },

    // Unsubscribe from scripts updates
    UnsubscribeScripts({state, rootState}) {
      // Unsubscribe from symbols list updates
      Vue.$cf.Unsubscribe(`symbols#${rootState.userId}`);
    },


  },
};

export default scripts;
