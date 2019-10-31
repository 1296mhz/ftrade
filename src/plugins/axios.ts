/* eslint-disable no-param-reassign */
import Vue from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.VUE_APP_BACKEND_API_URI ? process.env.VUE_APP_BACKEND_API_URI : ''}/`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosPlugin = {
  install(vueObj: any) {
    vueObj.$http = api;
    Object.defineProperty(Vue.prototype, '$http', { value: api });
  },
};

Vue.use(axiosPlugin);

declare module 'vue/types/vue' {
  export interface VueConstructor {
    $http: typeof api;
  }
  export interface Vue {
    $http: typeof api;
  }
}
