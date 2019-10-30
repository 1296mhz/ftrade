import { MutationTree } from 'vuex';
import { AuthState, SuccessAuthData, AuthStatus } from './types';
import { SET_AUTH, SET_STATUS, EXIT } from './mutation-types';

export const mutations: MutationTree<AuthState> = {
  /**
   * Set auth
   * @param state
   * @param data
   */
  [SET_AUTH](state, data: SuccessAuthData) {
    state.token = data.token;
    state.status = {
      state: true,
      message: '',
    };
    state.username = data.username;
    state.id = data.id;
  },

  /**
   * Set status auth
   * @param state
   * @param status
   */
  [SET_STATUS](state, status: AuthStatus) {
    state.status = status;
  },

  /**
   * Logout
   * @param state
   */
  [EXIT](state) {
    state.token = state.username = state.id = '';
    state.status = {
      state: false,
      message: 'Unknown',
    };
  },
};