import {
  IAuthState,
} from './types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { Module } from 'vuex';
import { RootState } from '@/store/types';
import Vue from 'vue';

const namespaced: boolean = true;

const init = {
  token: '',
  status: {
    state: false,
    message: '',
  },
  username: '',
  id: '',
}

const token = localStorage.getItem('token');
if (token) {
  const unpakedToken: any = Vue.$utils.parseJwt(token);
  const n: number = +new Date() / 1000;
  if (unpakedToken.exp >= n) {
    init.token = token;
    init.id = unpakedToken.sub;
  }
}
init.username = localStorage.getItem('username');

export const state: IAuthState = init;

const authModule: Module<IAuthState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};

export default authModule;
export const namespace = 'auth';
