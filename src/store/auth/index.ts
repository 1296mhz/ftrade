import {
  AuthState,
  AuthStatus,
} from './types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { Module } from 'vuex';
import { RootState } from '@/store/types';

const namespaced: boolean = true;

export const state: AuthState = {
  token: '',
  status: AuthStatus.Unknown,
  username: '',
  id: '',
};

const authModule: Module<AuthState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};

export default authModule;
export const namespace = 'auth';