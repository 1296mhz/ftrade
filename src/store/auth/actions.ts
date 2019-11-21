import Vue from 'vue';
import { IAuthState, IAuthData } from './types';
import { SET_STATUS, EXIT, SET_AUTH } from './mutation-types';
import { ActionTree } from 'vuex';
import { IMainState } from '@/store/types';
import router from '@/router';

export const actions: ActionTree<IAuthState, IMainState> = {
  /**
   * Login
   * @param param0
   * @param data { username: string, password: string }
   */
  async login({ commit, dispatch }, data: IAuthData) {
    const loading = {
      state: true,
      message: 'Loading',
    };
    commit(SET_STATUS, loading);

    try {
      const response: any = await Vue.$axios.get(`/auth?user=${data.username}&pass=${data.password}`);
      const unpackedToken: any = Vue.$utils.parseJwt(response.data);

      const userAccount = {
        token: response.data,
        id: unpackedToken.sub,
        username: data.username,
      };
      const completed = {
        state: false,
        message: 'Completed',
      };
      commit(SET_STATUS, completed);
      commit(SET_AUTH, userAccount);

      localStorage.setItem('username', userAccount.username);
      localStorage.setItem('token', userAccount.token);

      Vue.$centrifuge.setId(userAccount.id);
      Vue.$centrifuge.setToken(response.data);
      Vue.$centrifuge.connect();
    } catch (err) {
      let message = err;
      if (err.response) {
        message = err.response.data;
      }
      const error = {
        state: true,
        message: message,
      };
      commit(SET_STATUS, error);
    }
  },
  loginToken({ commit, dispatch, state }) {
    const loading = {
      state: true,
      message: 'Loading',
    };
    commit(SET_STATUS, loading);
    try {
      const unpakedToken: any = Vue.$utils.parseJwt(state.token);
      const userAccount = {
        token: state.token,
        id: unpakedToken.sub,
        username: state.username,
      };
      const completed = {
        state: false,
        message: 'Completed',
      };
      commit(SET_STATUS, completed);
      commit(SET_AUTH, userAccount);

      Vue.$centrifuge.setId(userAccount.id);
      Vue.$centrifuge.setToken(state.token);
      Vue.$centrifuge.connect();
    } catch (err) {
      let message = err;
      if (err.response) {
        message = err.response.data;
      }
      const error = {
        state: true,
        message: message,
      };
      commit(SET_STATUS, error);
    }

  },
  /**
   * Logout
   * @param param0
   */
  exit({ commit }) {
    commit(EXIT);
    Vue.$centrifuge.disconnect();
  },
};
