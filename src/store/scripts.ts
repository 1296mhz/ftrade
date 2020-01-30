import Vue from 'vue';
import uuid from 'uuid/v4';
import { Module } from 'vuex';
import { IMainState, ITest } from './types';

// Scripts state interface
export interface IScriptsState {
  category: ICategory;
  script: IScript;
  categories: ICategory[];
  test: ITest;
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

  namespaced: true,

  // State
  state: {
    categories: [],

    category: {
      id: '',
      name: '',
      scripts: [],
    },

    script: {
      id: '',
      name: '',
      category: '',
      source: '',
    },

    test: {
      id: '',
      name: '',
      parent: '',
      state: '',
      progress: 0,
      begin: 0,
      end: 0,
      interval: 0,
      strategies: [],
    },
  },

  // Getters
  getters: {
    // Find unique category name
    newCategoryName: (state) => {
      let name: string;
      let idx = 0;
      do {
        ++idx;
        name = 'Category ' + idx.toString();
      } while (state.categories.some((cat) => cat.name === name));
      return name;
    },
    // Find unique script name
    newScriptName: (state) => {
      let name: string;
      let idx = 0;
      do {
        ++idx;
        name = 'Script ' + idx.toString();
      } while (state.categories.some((cat) => cat.scripts.some((s) => s.name === name)));
      return name;
    },
  },

  // Mutations
  mutations:  {
    // Update categories tree
    SetCategories(state, categories: ICategory[]) {
      state.categories = categories;
    },
    CreateScript(state, script: IScript) {
      const cat: ICategory =  state.categories.find((cat) => cat.id === script.category);
      if (cat) {
        cat.scripts.push(script);
      }
    },
    DeleteScript(state, id: string) {
      state.categories.forEach((cat) => {
        cat.scripts = cat.scripts.filter((script) => script.id !== id);
      });
    },
    UpdateScript(state, update: IScript) {
      const src: ICategory =  state.categories.find((cat) => {
        return cat.scripts.find((scr) => scr.id === update.id);
      });
      const dst: ICategory =  state.categories.find((cat) => cat.id === update.category);
      const script = src.scripts.find((scr) => scr.id === update.id);

      // Change category
      if (src.id !== dst.id) {
        src.scripts = src.scripts.filter((scr) => scr.id !== update.id);
        dst.scripts.push(script);
      }

      script.name = update.name;
    },


    CreateCategory(state, category: ICategory) {
      state.categories.push(category);
    },
    DeleteCategory(state, id: string) {
      state.categories = state.categories.filter((cat) => cat.id !== id);
    },


    // Update current category
    SetCategory(state, category: ICategory) {
      state.category = category;
      state.script.id = '';
    },

    // Update current script data
    SetScript(state, script: IScript) {
      state.script = script;
      state.category.id = '';
    },
    SetScriptName(state, name: string)          { state.script.name = name; },
    SetScriptCategory(state, category: string)  { state.script.category = category; },
    SetScriptSource(state, source: string)      { state.script.source = source; },

    // Update current test data
    SetTest(state, test: ITest)                 { state.test = test; },

    SetTestBegin(state, begin: number)          { state.test.begin = begin; },
    SetTestEnd(state, end: number)              { state.test.end = end; },
    SetTestInterval(state, interval: number)    { state.test.interval = interval; },
  },

  // Actions
  actions: {

    // Request user scripts
    async GetScripts({commit}) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetScripts'});
        // data.forEach((cat: ICategory) => cat.id = cat.name);
        commit('SetCategories', data);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Request user script data by id
    async GetScript({commit}, id: string) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetScript', params: {id: id}});
        commit('SetScript', data);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Create user script
    async CreateScript({state, commit}, script: IScript) {
      try {
        await Vue.$cf.RPC({ method: 'CreateScript', params: script });
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Delete user script
    async DeleteScript({state, commit}) {
      try {
        if (state.script.id) {
          await Vue.$cf.RPC({ method: 'DeleteScript', params: {id: state.script.id}});
        }
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Update user script
    async UpdateScript({state, commit}) {
      try {
        if (state.script.id) {
          await Vue.$cf.RPC({method: 'UpdateScript', params: state.script});
        }
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Create script category
    async CreateCategory({state, commit}) {
      try {
        // TODO use function call
        // Find unique category name
        let name: string;
        let idx = 0;
        do {
          ++idx;
          name = 'Category ' + idx.toString();
        } while (state.categories.some((cat) => cat.name === name));

        await Vue.$cf.RPC({ method: 'CreateCategory', params: {
          id: uuid(),
          name: name,
        }});
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Delete script category
    async DeleteCategory({state, commit}) {
      try {
        if (state.category.id) {
          await Vue.$cf.RPC({ method: 'DeleteCategory', params: {id: state.category.id}});
        }
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },


    // Subscribe to scripts updates
    SubscribeScripts({state, commit, rootState}) {
      Vue.$cf.Subscribe(`categories#${rootState.userId}`, ({data}) => {
        if (data.command === 'create') {
          commit('CreateCategory', data.params);
        } else
        if (data.command === 'delete') {
          commit('DeleteCategory', data.params.id);
        }
      });

      Vue.$cf.Subscribe(`scripts#${rootState.userId}`, ({data}) => {
        if (data.command === 'create') {
          commit('CreateScript', data.params);
        } else
        if (data.command === 'delete') {
          commit('DeleteScript', data.params.id);
        } else
        if (data.command === 'update') {
          commit('UpdateScript', data.params);
        }
      });
    },

    // Unsubscribe from scripts updates
    UnsubscribeScripts({state, rootState}) {
      Vue.$cf.Unsubscribe(`categories#${rootState.userId}`);
      Vue.$cf.Unsubscribe(`scripts#${rootState.userId}`);
    },

    // Request user test data by id
    async GetTest({commit}, id: string) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetTest', params: {id: id}});
        commit('SetTest', data);
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Create user test
    async CreateTest({state, commit}, test: ITest) {
      try {
        await Vue.$cf.RPC({ method: 'CreateTest', params: test });
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

    // Update user script
    async UpdateTest({state, commit}) {
      try {
        await Vue.$cf.RPC({method: 'UpdateTest', params: state.test});
      } catch (error) {
        commit('SetError', error, {root: true});
        throw error;
      }
    },

  },
};

export default scripts;
