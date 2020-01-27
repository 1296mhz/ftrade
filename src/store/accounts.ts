import Vue from 'vue';
import { Module } from 'vuex';
import { IMainState } from './types';

export interface IAccountsState {
  vaccounts: IVAccount[];
  raccounts: IRAccount[];
  trades: ITrades[];
  vaccountId: string;
}

export interface IVAccount {
  id: string;
  name : string;
  executor: string;
  raccount: string;
}

export interface IRAccount {
  id: string;
  name : string;
  executor: string;
}

export interface ITrade {
  time: number;
  id: string;
  ticker: string;
  account: string;
  order: string;
  side: string;
  price: number;
  volume: number;
  fee: number;
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
    GetVAccounts(state, vaccounts: IVAccount[]) {
      Vue.set(state, 'vaccounts', vaccounts);
    },
    GetRAccounts(state, raccounts: IRAccount[]) {
      Vue.set(state, 'raccounts', raccounts);
    },
    GetVAccountTrades(state, trades: ITrade[]) {
      Vue.set(state, 'trades', trades);
    },
    SetVAccountId(state, vaccountId: string) {
      Vue.set(state, 'vaccountId', vaccountId);
    },
  },

  // Actions
  actions: {
    /*
    example - GetVAccounts returned:
    [{"id":"id0001","name":"VAccount 0001","executor":"executor1","raccount":"rid1"}]"
    */
    async GetVAccounts({commit}) {
      try {
        const vaccounts = await Vue.$cf.RPC({ method: 'GetVAccounts' });
        console.log(vaccounts)
        commit('GetVAccounts', vaccounts)
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    async CreateVAccount({commit, dispatch}, newVAccount: any) {
      console.log(newVAccount)
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
        //commit('GetVAccountOrders', vaccounts)
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    /*
    accountId: id virtual account
    example - GetVAccountTrades returned: 
    "[{"time":1579844902000,"id":"3ae565bf-22a4-48eb-8aac-69fe6b8fb559","ticker":"RTS.FORTS.Z2019","account":"id0001","order":"","side":"sell","price":110050,"volume":1,"fee":0}]"
    */
    async GetVAccountTrades({commit}, accountId: string) {
      try {
        const trades = await Vue.$cf.RPC({ method: 'GetVAccountTrades', params: { account: accountId } } );
       commit('GetVAccountTrades', trades)
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    DeleteRAccount() {},
    CreateRAccount() {},
    /*
    example - GetRAccounts returned:
    "[{"id":"rid1","name":"Ex1-Account 1","executor":"executor1"}]"
    */
    async GetRAccounts({commit}) {
      try {
        const raccounts = await Vue.$cf.RPC({ method: 'GetRAccounts' });
        console.log(raccounts)
       commit('GetRAccounts', raccounts)
      } catch (error) {
        commit('SetError', error);
        throw error;
      }
    },
    SetVAccountId({commit}, vaccountId) {
       commit('SetVAccountId', vaccountId)
    },
  },
  }

export default accounts;