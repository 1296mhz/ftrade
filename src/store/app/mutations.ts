import { MutationTree } from 'vuex';
import Vue from 'vue';
import { AppState } from './types';

import {
  SET_DRAWER,
  SET_CURRENT_VIEW,
} from './mutation-types';

export const mutations: MutationTree<AppState> = {
  [SET_DRAWER](state: AppState, data: any) {
     Vue.set(state, 'drawer', data);
  },
  [SET_CURRENT_VIEW](state: AppState, data: any) {
    Vue.set(state, 'currentView', data);
 },
};