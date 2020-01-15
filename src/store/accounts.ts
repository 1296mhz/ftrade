import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState } from './types';

export interface IAccountsState {

}

const accounts: Module<IAccountsState, IMainState> = {

  // State
  state: {
  },

  // Mutations
  mutations:  {},

  // Actions
  actions: {},
  }

export default accounts;