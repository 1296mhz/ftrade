import Vue from 'vue';
import centrifuge from 'centrifuge';
import store from '../store';
import { IOhlcParams } from '../store/terminal/types';
import { eventBus } from '../main';
import SymbolSubsTerminal from './centrifuge/SymbolSubsTerminal';
import OrdersSubsTerminal from './centrifuge/OrdersSubsTerminal';

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
  public symbolSubscribesTerminal = new SymbolSubsTerminal();
  public ordersSubsTerminal = new OrdersSubsTerminal();
  private id: string = '';
  constructor(url) {
    store.dispatch('app/centrifugeConnectedFlag', false);
    this.instance = new centrifuge(url, {
      minRetry: 1000,
      maxRetry: 10000,
      onTransportClose: (ctx: any) => {
        eventBus.$emit('warn', `Trying reconnect! Error code: ${ctx.event.code}, Message: ${ctx.reason}`);
      },
    });

    this.instance.on('connect', async (ctx) => {
      Vue.$log.debug(ctx)
      store.dispatch('app/centrifugeConnectedFlag', true);
      this.ordersSubsTerminal.subscribe(this.instance, store, 'id0001', this.id);
    });

    this.instance.on('disconnect', function (ctx) {
      Vue.$log.error(`Disconnected: ${ctx}`)
      store.dispatch('app/centrifugeConnectedFlag', false);
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
    this.instance.disconnect();
  }

  public async getSymbols() {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetSymbols' });
      this.symbolSubscribesTerminal.subscribeMassive(this.instance, store, response.data);
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

  public async getAccountOrders(account) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetAccountOrders', params: { account: account } });
      return (responseHandler(response)) ? response.data : 'error';
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
