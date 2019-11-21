import { AppState } from './types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { Module } from 'vuex';
import { IMainState } from '@/store/types';

const namespaced: boolean = true;

export const state: AppState = {
  drawer: null,
  currentView: '',
  accounts: [],
  appReady: false,
  centrifugeConnectedFlag: false,
  currentAccount: null,
};

const appModule: Module<AppState, IMainState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};

export default appModule;
export const namespace = 'app';
