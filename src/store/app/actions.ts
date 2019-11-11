import Vue from 'vue';
import { AppState } from './types';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import {
  SET_DRAWER,
  SET_CURRENT_VIEW,
  SET_CENTRIFUGE_CONNECTED_FLAG,
  SET_ACCOUNTS,
} from './mutation-types';

/*
An asynchronous operation is performed here, the result of its execution is committed to a mutation.
For the test, here we have fake data transferred to the mutation
*/
export const actions: ActionTree<AppState, RootState> = {
  async drawer({ commit, state }, payload) {
    commit(SET_DRAWER, payload);
  },
  async currentView({ commit, state }, payload) {
    commit(SET_CURRENT_VIEW, payload);
  },
  async accounts({ commit, state}, params) {
    console.log("SETACCOUNTS")
    const accounts = await Vue.$centrifuge.getAccounts();
    console.log("accounts", accounts)
   
    commit(SET_ACCOUNTS, accounts);
  },
  centrifugeConnectedFlag({ commit, state}, params) {
    commit(  SET_CENTRIFUGE_CONNECTED_FLAG, params)
  }
};
