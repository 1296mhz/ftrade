import Vue from 'vue';
import { AppState } from './types';
import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';

export const getters: GetterTree<AppState, RootState> = {
  DRAWER(state: AppState): any {
    return state.drawer;
  },
  CURRENT_VIEW(state: AppState): any {
    return state.currentView;
  },
  ACCOUNTS(state: AppState): any {
    return Vue.$_.map(state.accounts[0], (item: any, index) => {
      return {
        text: item.Name,
        value: item.Id,
      }
    });
   
  },
  CENTRIFUGE_CONNECTED_FLAG(state: AppState): boolean {
    return state.centrifugeConnectedFlag;
  },
};
