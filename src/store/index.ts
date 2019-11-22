import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IMainState, ILoginPayload, IAccount } from './types';
import AppModule, { state as AppState, state } from './app';
import AuthModule, { state as AuthState } from './auth';
import TerminalModule, { state as TerminalState } from './terminal/index';
import jwt_decode from 'jwt-decode';

Vue.use(Vuex);

const options: StoreOptions<IMainState> = {

  // State
  state: {
    // Connection
    connected: false,
    error: '',
    userId: '',

    // Accounts
    accounts: [],

    app: AppState,
    auth: AuthState,
    terminal: TerminalState,
  },

  // Mutations
  mutations:  {
    SetUserId(state, id: string) {
      state.userId = id;
    },

    SetConnected(state, connected: boolean) {
      state.connected = connected;
    },

    SetError(state, error: string) {
      state.error = error;
    },

    SetAccounts(state, accounts: IAccount[]) {
      state.accounts = accounts;
    },
  },

  // Actions
  actions: {

    // Login to server action
    //   get auth token
    //   connect to centrifuge server
    //   get initial user data
    async Login({commit}, payload: ILoginPayload) {

      try {
        // Request token
        const resp = await Vue.$axios.get(`/auth?user=${payload.username}&pass=${payload.password}`);
        const token = resp.data;

        // Parse
        const data: any = jwt_decode(token);
        commit('SetUserId', data.sub);

        // Centrifuge connect
        Vue.$cf.setToken(token);
        Vue.$cf.removeAllListeners();
        Vue.$cf.on('connect', (ctx) => {
          commit('SetConnected', true);
        });
        Vue.$cf.on('disconnect', (ctx) => {
          commit('SetConnected', false);
        });

        // Resolve on connect
        return new Promise((resolve, reject) => {
          Vue.$cf.on('connect', (ctx) => {
            resolve();
          });
          Vue.$cf.on('disconnect', (ctx) => {
            reject();
          });
          Vue.$cf.connect();
        });

      } catch (err) {
        commit('SetError', err.message);
        throw err;
      }
    },

    // Request user virtual accounts
    async GetAccounts({commit}) {
      const resp = await Vue.$cf.rpc({ method: 'GetAccounts' });
      console.log(resp);
      commit('SetAccounts', resp.data);
    },
  },


  modules: {
    app: AppModule,
    auth: AuthModule,
    terminal: TerminalModule,
  },
};

export default new Vuex.Store<IMainState>(options);
