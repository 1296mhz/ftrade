import { GetterTree } from 'vuex';
import { AuthState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<AuthState, RootState> = {
  /**
   * Get auth status
   */
  status(state) {
    return state.status;
  },
};