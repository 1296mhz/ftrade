import Vue from 'vue';
import centrifuge from 'centrifuge';



class CentrifugeManager {
  instance: any;
  constructor(url) {
    this.instance = new centrifuge(url);;
  }

  setToken(token) {
    this.instance.setToken(token)
  }

  connect() {
    this.instance.connect();
  }

  disconnect() {
    this.instance.disconnect();
  }
  
}

const instance = new CentrifugeManager('ws://localhost:8090/connection/websocket');

const plugin = {
  install(obj: any) {
    obj[`$centrifuge`] = instance,
    Object.defineProperty(Vue.prototype, `$centrifuge`, { value: instance });
  },
};

Vue.use(plugin);

declare module 'vue/types/vue' {
  export interface VueConstructor {
    $centrifuge: CentrifugeManager;
  }
  export interface Vue {
    $centrifuge: CentrifugeManager;

  }
}
