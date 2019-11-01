import Vue from 'vue';
import jwt_decode from 'jwt-decode';

const constants = {
  END_DATE_OHLC: () => {
    return Number(process.env.VUE_APP_END_DATE_OHLC)
  },
};

const constantsPlugin = {
  install(vueObj: any) {
    vueObj.$constants = constants;
    Object.defineProperty(Vue.prototype, '$constants', { value: constants });
  },
};

Vue.use(constantsPlugin);
declare module 'vue/types/vue' {
  export interface VueConstructor {
    $constants: typeof constants;
  }
  export interface Vue {
    $constants: typeof constants;
  }
}