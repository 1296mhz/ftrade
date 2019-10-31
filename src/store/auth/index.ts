import {
  IAuthState,
} from './types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { Module } from 'vuex';
import { RootState } from '@/store/types';

const namespaced: boolean = true;

export const state: IAuthState = {
  token: '',
  status: {
    state: false,
    message: '',
  },
  username: '',
  id: '',
};

const authModule: Module<IAuthState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};

export default authModule;
export const namespace = 'auth';
