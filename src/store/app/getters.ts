import Vue from 'vue';
import { AppState } from './types';
import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';

export const getters: GetterTree<AppState, RootState> = {
  DRAWER(state: AppState, getters: any): any {
    return state.drawer;
  },
  CURRENT_VIEW(state: AppState, getters: any): any {
    return state.currentView;
  },
};