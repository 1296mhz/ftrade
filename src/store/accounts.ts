import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState, ITrade, IVAccount, IRAccount } from './types';

export interface IAccountsState {
  vaccounts: IVAccount[];
  raccounts: IRAccount[];
  trades: ITrade[];
  vaccountId: string;
}

const accounts: Module<IAccountsState, IMainState> = {

  // State
  state: {
    vaccounts: [],
    raccounts: [],
    trades: [],
    vaccountId: '',
  },

  // Mutations
  mutations:  {
    SetVAccounts(state, vaccounts: IVAccount[]) {
      // Vue.set(state, 'vaccounts', vaccounts);
      state.vaccounts = vaccounts;
    },
    SetRAccounts(state, raccounts: IRAccount[]) {
      // Vue.set(state, 'raccounts', raccounts);
      state.raccounts = raccounts;
    },
    SetVAccountTrades(state, trades: ITrade[]) {
      Vue.set(state, 'trades', trades);
    },
    SetVAccountId(state, vaccountId: string) {
      Vue.set(state, 'vaccountId', vaccountId);
    },
  },

  // Actions
  actions: {
    // Request user virtual accounts
    async GetVAccounts({commit}) {
      try {
        const vaccounts = await Vue.$cf.RPC({ method: 'GetVAccounts' });
        commit('SetVAccounts', vaccounts);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    async CreateVAccount({commit, dispatch}, newVAccount: any) {
      try {
        await Vue.$cf.RPC({ method: 'CreateVAccount', params: newVAccount });
        await dispatch('GetVAccounts');
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    async DeleteVAccount({commit, dispatch}, accountId: string) {
      try {
        await Vue.$cf.RPC({ method: 'DeleteVAccount', params: { id: accountId } });
        await dispatch('GetVAccounts');
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    async GetVAccountOrders({commit}) {
      try {
        const orders = await Vue.$cf.RPC({ method: 'GetVAccountOrders' });
        // commit('GetVAccountOrders', vaccounts)
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },

    async GetVAccountTrades({commit}, accountId: string) {
      try {
        const trades = await Vue.$cf.RPC({ method: 'GetVAccountTrades', params: {account: accountId}});
        commit('GetVAccountTrades', trades);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    DeleteRAccount() {/* */},
    CreateRAccount() {/* */},

    async GetRAccounts({commit}) {
      try {
        const raccounts = await Vue.$cf.RPC({ method: 'GetRAccounts' });
        // console.log(raccounts)
        commit('SetRAccounts', raccounts);
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    SetVAccountId({commit}, vaccountId) {
       commit('SetVAccountId', vaccountId);
    },
  },
};

export default accounts;
