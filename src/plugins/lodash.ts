import Vue from 'vue';
import _ from 'lodash';

const lodashPlugin = {
  install(vueObj: any) {
    vueObj.$_ = _;
    Object.defineProperty(Vue.prototype, '$_', { value: _ });
  },
};
Vue.use(lodashPlugin);
declare module 'vue/types/vue' {
  export interface VueConstructor {
    $_: typeof _;
  }
  export interface Vue {
    $_: typeof _;
  }
}

