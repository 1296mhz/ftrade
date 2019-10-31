import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.use(VueToast);

declare module 'vue/types/vue' {
  export interface VueConstructor {
    $toast: typeof VueToast;
  }
  export interface Vue {
    $toast: typeof VueToast;
  }
}