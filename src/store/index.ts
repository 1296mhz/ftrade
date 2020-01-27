import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IMainState, ILoginPayload, IAccount } from './types';
import terminal from './terminal';
import scripts from './scripts';
import accounts from './accounts';
import jwt_decode from 'jwt-decode';

Vue.use(Vuex);

const options: StoreOptions<IMainState> = {

  // State
  state: {
    // Connection
    connected: false,
    errors: [],
    userId: '',
    // Virtual Accounts
    vaccounts: [],
  },

  // Getters
  getters: {
    // vaccounts: (state) => {
    //   return state.vaccounts.map((acc) => {
    //     return {
    //       value: acc.id,
    //       text: acc.name };
    //   });
    // },

    lastError: (state) => {
      return state.errors.length > 0 ? state.errors[state.errors.length - 1] : '';
    },

    errorsCount: (state) => {
      return state.errors.length;
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
      state.errors.push(error);
    },

    // SetAccounts(state, vaccounts: IAccount[]) {
    //   state.vaccounts = vaccounts;
    // },
  },

  // Actions
  actions: {

    // Login to server action
    //   get auth token
    //   and put it in local storage
    async Login({commit}, payload: ILoginPayload) {
      try {
        // Request token
        const resp = await Vue.$axios.get(`/auth?user=${payload.username}&pass=${payload.password}`);
        const token = resp.data;

        // Save token
        localStorage.setItem('authToken', token);

      } catch (err) {
        commit('SetError', err.message);
        throw err;
      }
    },

    // Connect to server action
    //   get auth token from local storage
    //   connect to centrifuge server
    //   get initial user data
    async Connect({commit}) {

      try {
        // Try get token
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw Error('Auth token not found');
        }

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

    Logout({commit}) {
      localStorage.removeItem('authToken');
      commit('SetConnected', false);
      Vue.$cf.Disconnect();
    },
    // Request user virtual accounts
    // async GetAccounts({commit}) {
    //   try {
    //     const vaccounts = await Vue.$cf.RPC({ method: 'GetVAccounts' });
    //     commit('SetAccounts', vaccounts);
    //   } catch (error) {
    //     commit('SetError', error);
    //   }
    // },
  },

  modules: {
    terminal: terminal,
    scripts:  scripts,
    accounts: accounts,
  },
};

export default new Vuex.Store<IMainState>(options);
