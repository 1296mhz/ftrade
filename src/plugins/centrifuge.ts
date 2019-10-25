import Vue from 'vue';
import centrifuge from 'centrifuge';



class CentrifugeManager {
  instance: any;
  methods: any = {};
  connectFlag: boolean = false;
  constructor(url) {
    this.instance = new centrifuge(url);
    this.instance.on('connect', async (ctx) => {
      this.connectFlag = true;    
    });
    this.instance.on('disconnect', (ctx) => {
      this.connectFlag = false;
    });
    return this;
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

  async getSymbols() {
    if(this.connectFlag) {
      const response = await this.instance.rpc({ "method": "GetSymbols" });
      return response.data
    }
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
