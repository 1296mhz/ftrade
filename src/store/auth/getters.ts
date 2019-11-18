import { GetterTree } from 'vuex';
import { IAuthState } from './types';
import { RootState } from '@/store/types';
export const getters: GetterTree<IAuthState, RootState> = {
  /**
   * Get auth status
   */
  status(state) {
    return state.status;
  },
  token(state) {
    return state.token;
    // if (localStorage.getItem('token')) {
    //   const unpakedToken: any = Vue.$utils.parseJwt(localStorage.getItem('token'));
    //   const n: number = +new Date() / 1000;
    //   if (unpakedToken.exp < n) {
    //     return null;
    //   }
    //   return localStorage.getItem('token');
    // }
    // return null;
  },
  usernameToken(state) {
    return state.username
    // if (localStorage.getItem('username')) {
    //   return localStorage.getItem('username');
    // }
    // return null;
  }
};
