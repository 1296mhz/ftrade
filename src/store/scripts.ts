import Vue from 'vue';
import uuid from 'uuid/v4';
import { Module } from 'vuex';
import { IMainState } from './types';

// Scripts state interface
export interface IScriptsState {
  script: IScript;
  categories: ICategory[];
}

// Category
export interface ICategory {
  id: string;
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
    script: {
      id: '',
      name: '',
      category: '',
      source: '',
    },
    categories: [],
  },

  // Mutations
  mutations:  {

    // Update categories tree
    SetCategories(state, categories: ICategory[]) {
      state.categories = categories;
    },

    // Set current script data
    SetScript(state, script: IScript) {
      state.script = script;
    },
    SetScriptName(state, name: string) {
      state.script.name = name;
    },
    SetScriptCategory(state, category: string) {
      state.script.category = category;
    },
    SetScriptSource(state, source: string) {
      state.script.source = source;
    },

  },

  // Actions
  actions: {

    // Request user scripts
    async GetScripts({commit}) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetScripts'});
        data.forEach((cat: ICategory) => cat.id = cat.name);
        commit('SetCategories', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Request user script data by id
    async GetScript({commit}, id: string) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetScript', params: {id: id}});
        commit('SetScript', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Create user script
    async CreateScript({state, commit}, category: string) {
      try {
        const cat =  state.categories.find((cat) => cat.name === category);
        let name = 'Script 1';

        // Find unique script name
        if (cat) {
          let idx = 1;
          cat.scripts.forEach((script) => {
            if (script.name === name) {
              ++idx;
              name = 'Script ' + idx.toString();
            }
          });
        }

        await Vue.$cf.RPC({ method: 'CreateScript', params: {
          id: uuid(),
          name: name,
          category: category,
          source: '',
        }});
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
