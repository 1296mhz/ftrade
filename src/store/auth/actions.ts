import Vue from 'vue';
import { AuthState, AuthData, AuthStatus } from './types';
import { SET_STATUS, EXIT, SET_AUTH } from './mutation-types';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import router from '@/router';

export const actions: ActionTree<AuthState, RootState> = {
  /**
   * Login
   * @param param0
   * @param data { username: string, password: string }
   */
  async login({ commit, dispatch }, data: AuthData) {
    commit(SET_STATUS, AuthStatus.Loading);
    try {
      const response: any = await Vue.$http.get(`/auth?user=${data.username}&pass=${data.password}`);
      const unpakedToken: any = Vue.$utils.parseJwt(response.data);

      const userAccount = {
        token: response.data,
        id: unpakedToken.sub,
        username: data.username,
      }
      commit(SET_STATUS, AuthStatus.Success);
      commit(SET_AUTH, userAccount);
      Vue.$centrifuge.setId(userAccount.id);
      Vue.$centrifuge.setToken(response.data);
      Vue.$centrifuge.connect();
    } catch {
      commit(SET_STATUS, AuthStatus.Failed);
    }
  },

  /**
   * Logout
   * @param param0
   */
  exit({ commit }) {
    commit(EXIT);
    Vue.$centrifuge.disconnect();
    router.push('login');
  },
};
