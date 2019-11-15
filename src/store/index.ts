import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

Vue.use(Vuex);

// Main state interface
interface State {
  count: number;
}

// Store object
const store: StoreOptions<State> = {
  // Main State
  state: {
    count: 0,
  },


  // Getters
  getters: {
    evenOrOdd: (state: State) => state.count % 2 === 0 ? 'even' : 'odd',
  },


  // Mutations
  mutations:  {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },


  // Actions
  actions: {
    increment: ({commit}) => commit('increment'),
    decrement: ({ commit }) => commit('decrement'),
    incrementIfOdd({ commit, state }) {
      if ((state.count + 1) % 2 === 0) {
        commit('increment');
      }
    },
    incrementAsync({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('increment');
          resolve();
        }, 1000);
      });
    },
  },
};

export default new Vuex.Store(store);
