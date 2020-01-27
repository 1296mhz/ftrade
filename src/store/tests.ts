import Vue from 'vue';
import uuid from 'uuid/v4';
import { Module } from 'vuex';
import { IMainState } from './types';

// Tests state interface
export interface ITestsState {
  test: ITest;
}

// Test
export interface ITest {
  id: string;
  name: string;
  parent: string;
  state: string;
  progress: number;
  begin: number;
  end: number;
  interval: number;
  strategies: IStrategy[];
}

// Strategy
export interface IStrategy {
  id: string;
  name: string;
  source: string;
}


// Tests storage module
const tests: Module<ITestsState, IMainState> = {

  // State
  state: {
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

  // Mutations
  mutations:  {
    // Update current test data
    SetTest(state, test: ITest) {
      state.test = test;
    },

  },

  // Actions
  actions: {

    // Request user test data by id
    async GetTest({commit}, id: string) {
      try {
        const data = await Vue.$cf.RPC({method: 'GetTest', params: {id: id}});
        commit('SetTest', data);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Create user test
    async CreateTest({state, commit}, test: ITest) {
      try {
        await Vue.$cf.RPC({ method: 'CreateTest', params: test });
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    // Update user script
    async UpdateTest({state, commit}) {
      /*
      try {
        if (state.script.id) {
          await Vue.$cf.RPC({method: 'UpdateScript', params: state.script});
        }
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
      */
    },





  },
};

export default tests;
