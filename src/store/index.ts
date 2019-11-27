import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IMainState, ILoginPayload, IAccount } from './types';
import AppModule, { state as AppState, state } from './app';
import AuthModule, { state as AuthState } from './auth';
// import TerminalModule, { state as TerminalState } from './terminal/index';
import terminal from './terminal';
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
    // terminal: TerminalState,
  },

  // Getters
  getters: {
    accounts: (state) => {
      return state.accounts.map((acc) => {
        return {
          value: acc.id,
          text: acc.name };
      });
    },
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
        Vue.$cf.SetToken(token);
        Vue.$cf.RemoveAllListeners();
        Vue.$cf.On('connect', (ctx) => {
          commit('SetConnected', true);
        });
        Vue.$cf.On('disconnect', (ctx) => {
          commit('SetConnected', false);
        });

        // Resolve on connect
        return new Promise((resolve, reject) => {
          Vue.$cf.On('connect', (ctx) => {
            resolve();
          });
          Vue.$cf.On('disconnect', (ctx) => {
            reject();
          });
          Vue.$cf.Connect();
        });

      } catch (err) {
        commit('SetError', err.message);
        throw err;
      }
    },

    // Request user virtual accounts
    GetAccounts({commit}) {
      return Vue.$cf.RPC({ method: 'GetAccounts' }).then((data) => {
        commit('SetAccounts', data);
      }).catch((error) => {
        commit('SetError', error);
      });
    },
  },


  modules: {
    app: AppModule,
    auth: AuthModule,
    terminal: terminal,
  },
};

export default new Vuex.Store<IMainState>(options);
