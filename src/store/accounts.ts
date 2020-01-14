import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState } from './types';

export interface IAccountsState {
  categories: ICategory[];
}

const accounts: Module<IAccountsState, IMainState> = {

  // State
  state: {
    categories: [],
  },

  // Mutations
  mutations:  {},

  // Actions
  actions: {},
  }






export default accounts;