import Vue from 'vue';
import centrifuge from 'centrifuge';
import store from '../store';
import { IOhlcParams } from '../store/terminal/types';
import { eventBus } from '../main';

function errorHandler(response) {
  Vue.$log.error(`Error: ${response}`);
  if (response.code) {
    eventBus.$emit('error', `Error code: ${response.code}, Message: ${response.message}` );
    return false;
  } else {
    return true;
  }
}
class CentrifugeManager {
  public instance: any;
  private id: string = '';
  private connectFlag: boolean = false;
  constructor(url) {
    this.instance = new centrifuge(url);
    this.instance.on('connect', async (ctx) => {
      this.connectFlag = true;

      this.instance.subscribe(`symbols#${this.id}`, (message) => {
        switch (message.data.Command) {
          case 'delete':
            store.dispatch('terminal/deleteSymbolInStorage', message.data);
            break;
          case 'create':
            store.dispatch('terminal/createSymbolInStorage', message.data);
            break;
        }
      });
    });

    this.instance.on('error', (ctx) => {
      Vue.$log.debug(`Error: ${ctx}`);
    });

    this.instance.on('disconnect', (ctx) => {
      this.connectFlag = false;
      this.instance.removeAllListeners();
    });
    return this;
  }

  public setToken(token) {
    this.instance.setToken(token);
  }

  public setId(id) {
    this.id = id;
  }
  public connect() {
    this.instance.connect();
  }

  public disconnect() {
    this.instance.removeAllListeners();
    this.instance.disconnect();
  }

  public async getSymbols() {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'GetSymbols' });
      return (errorHandler(response)) ? response.data : 'error';
    }
  }

  public async createSymbol(ticker: string) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'CreateSymbol', params: { ticker: ticker } });
      return (errorHandler(response)) ? response : 'error';
    }
  }

  public async deleteSymbol(ticker: string) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'DeleteSymbol', params: ticker });
      return (errorHandler(response)) ? response : 'error';
    }
  }

  public async getOhlc(params: IOhlcParams) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'GetOhlc', params: params });
      return response;
    }
  }
}

const instance = new CentrifugeManager(`${process.env.VUE_APP_BACKEND_SOCKET_URI ? process.env.VUE_APP_BACKEND_SOCKET_URI : ''}/connection/websocket`);

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
