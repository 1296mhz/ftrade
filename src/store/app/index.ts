import { AppState } from './types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { Module } from 'vuex';
import { RootState } from '@/store/types';

const namespaced: boolean = true;

export const state: AppState = {
  drawer: null,
  currentView: '',
};

const appModule: Module<AppState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};

export default appModule;
export const namespace = 'app';
