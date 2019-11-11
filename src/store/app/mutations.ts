import { MutationTree } from 'vuex';
import Vue from 'vue';
import { AppState } from './types';

import {
  SET_DRAWER,
  SET_CURRENT_VIEW,
  SET_CENTRIFUGE_CONNECTED_FLAG,
  SET_ACCOUNTS,
  SET_APP_READY,
} from './mutation-types';

export const mutations: MutationTree<AppState> = {
  [SET_DRAWER](state: AppState, data: any) {
    Vue.set(state, 'drawer', data);
  },
  [SET_CURRENT_VIEW](state: AppState, data: any) {
    Vue.set(state, 'currentView', data);
  },
  [SET_CENTRIFUGE_CONNECTED_FLAG](state: AppState, data: boolean) {
    Vue.set(state, 'centrifugeConnectedFlag', data);
  },
  [SET_ACCOUNTS](state: AppState, data: any) {
    console.log(data)
    const newAccountsList = [...state.accounts, data];
    Vue.set(state, 'accounts', newAccountsList);
  },
  [SET_APP_READY](state: AppState, data: boolean) {
    Vue.set(state, 'appReaday', data);
  }
};
