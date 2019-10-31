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
};
