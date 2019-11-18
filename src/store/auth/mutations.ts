import { MutationTree } from 'vuex';
import { IAuthState, ISuccessAuthData, IAuthStatus } from './types';
import { SET_AUTH, SET_STATUS, EXIT } from './mutation-types';

export const mutations: MutationTree<IAuthState> = {
  /**
   * Set auth
   * @param state
   * @param data
   */
  [SET_AUTH](state, data: ISuccessAuthData) {
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
  [SET_STATUS](state, status: IAuthStatus) {
    state.status = status;
  },

  /**
   * Logout
   * @param state
   */
  [EXIT](state) {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    state.token = state.username = state.id = '';
    state.status = {
      state: false,
      message: 'Unknown',
    };
  },
};
