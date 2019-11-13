import { MutationTree } from 'vuex';
import Vue from 'vue';
import { AppState, IAccount, IAccountCombobox } from './types';

import {
  SET_DRAWER,
  SET_CURRENT_VIEW,
  SET_CENTRIFUGE_CONNECTED_FLAG,
  SET_ACCOUNTS,
  SET_APP_READY,
  SET_CURRENT_ACCOUNT_COMBOBOX,
  SET_CURRENT_ACCOUNT,
} from './mutation-types';

export const mutations: MutationTree<AppState> = {
  [SET_DRAWER](state: AppState, data: any): void {
    Vue.set(state, 'drawer', data);
  },
  [SET_CURRENT_VIEW](state: AppState, data: any): void {
    Vue.set(state, 'currentView', data);
  },
  [SET_CENTRIFUGE_CONNECTED_FLAG](state: AppState, data: boolean): void {
    Vue.set(state, 'centrifugeConnectedFlag', data);
  },
  [SET_ACCOUNTS](state: AppState, data: any): void {
    const newAccountsList = [...state.accounts, data];
    Vue.set(state, 'accounts', newAccountsList);
  },
  [SET_APP_READY](state: AppState, data: boolean): void {
    Vue.set(state, 'appReaday', data);
  },
  [SET_CURRENT_ACCOUNT_COMBOBOX](state: AppState, data: IAccountCombobox): void {
    if (data) {
      Vue.set(state, 'currentAccount', {
        Name: data.text,
        Id: data.value,
      });
    }
  },
  [SET_CURRENT_ACCOUNT](state: AppState, data: IAccount): void {
    Vue.set(state, 'currentAccount', data);
  },
};
