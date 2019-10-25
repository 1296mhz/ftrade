import Vue from 'vue';
import centrifuge from 'centrifuge';
import store from '../store';
class CentrifugeManager {
  instance: any;
  methods: any = {};
  id: string = '';
  connectFlag: boolean = false;
  constructor(url) {
    this.instance = new centrifuge(url);
    this.instance.on('connect', async (ctx) => {
      this.connectFlag = true;
      this.instance.subscribe(`symbols#${this.id}`, (message) => {
        switch (message.data.Command) {
          case 'delete':
            store.dispatch('terminal/deleteSymbolInStorage', message.data);
            break;
        }

      });
    });
    this.instance.on('disconnect', (ctx) => {
      this.connectFlag = false;
    });
    return this;
  }

  setToken(token) {
    this.instance.setToken(token)
  }

  setId(id) {
    this.id = id;
  }
  connect() {
    this.instance.connect();
  }

  disconnect() {
    this.instance.disconnect();
  }

  async getSymbols() {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ "method": "GetSymbols" });
      return response.data
    }
  }

  async deleteSymbol(ticker: string) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'DeleteSymbol', params: ticker });
      return response
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
