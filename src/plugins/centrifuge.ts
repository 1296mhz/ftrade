import Vue from 'vue';
import centrifuge from 'centrifuge';
import store from '../store';
import { IOhlcParams } from '../store/terminal/types';
import { eventBus } from '../main';
import SymbolSubsTerminal from './centrifuge/SymbolSubsTerminal';

function responseHandler(response) {
  Vue.$log.debug(response);
  if (response.code) {
    eventBus.$emit('error', `Error code: ${response.code}, Message: ${response.message}`);
    return false;
  } else {
    return true;
  }
}

class CentrifugeManager {
  public instance: any;
  public symbolSubscribes = new SymbolSubsTerminal();
  private id: string = '';
  constructor(url) {
    store.dispatch('app/centrifugeConnectedFlag', false);
    this.instance = new centrifuge(url);

    this.instance.on('connect', async (ctx) => {
      this.instance.removeAllListeners();
      store.dispatch('app/centrifugeConnectedFlag', true);
      this.instance.subscribe(`symbols#${this.id}`, (message) => {
        switch (message.data.Command) {
          case 'delete':
            this.symbolSubscribes.unsubscribe(message);
            store.dispatch('terminal/deleteSymbolInStorage', message.data);
            break;
          case 'create':
            this.symbolSubscribes.subscribe(this.instance, store, message);
            store.dispatch('terminal/createSymbolInStorage', message.data);
            break;
        }
      });
    });

    this.instance.on('error', (ctx) => {
      store.dispatch('app/centrifugeConnectedFlag', false);
      eventBus.$emit('error', `Connection lost!`);
      Vue.$log.error(`Error instance: ${ctx}`);
    });

    this.instance.on('disconnect', (ctx) => {
      Vue.$log.error(`Disconnected: ${ctx}`);
      store.dispatch('app/centrifugeConnectedFlag', false);
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
    // Только после того как заработает дисконнект
    // store.dispatch('app/centrifugeConnectedFlag', false);
  }

  public async getSymbols() {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetSymbols' });
      this.symbolSubscribes.subscribeMassive(this.instance, store, response.data);
      return (responseHandler(response)) ? response.data : 'error';
    }
  }

  public async createSymbol(ticker: string) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'CreateSymbol', params: { ticker: ticker } });
      return (responseHandler(response)) ? response : 'error';
    }
  }

  public async deleteSymbol(ticker: string) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'DeleteSymbol', params: ticker });
      return (responseHandler(response)) ? response : 'error';
    }
  }

  public async getOhlc(params: IOhlcParams) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetOhlc', params: params });
      return (responseHandler(response)) ? response : 'error';
    }
  }

  public async getAccounts() {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetAccounts' });
      return (responseHandler(response)) ? response : 'error';
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
