/* eslint-disable no-param-reassign */
import Vue from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.highcharts.com/samples/data/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'crossDomain': true,
    'mode': 'no-cors',

  },
});

const axiosPlugin = {
  install(vueObj: any) {
    vueObj.$httpHighCharts = api;
    Object.defineProperty(Vue.prototype, '$httpHighCharts', { value: api });
  },
};

Vue.use(axiosPlugin);

declare module 'vue/types/vue' {
  export interface VueConstructor {
    $httpHighCharts: typeof api;
  }
  export interface Vue {
    $httpHighCharts: typeof api;
  }
}
