import Vue from 'vue';
import Centrifuge from 'centrifuge';
import store from '../store';
import { IOhlcParams } from '../store/terminal/types';
import { eventBus } from '../main';
import SymbolSubsTerminal from './centrifuge/SymbolSubsTerminal';
import OrdersSubsTerminal from './centrifuge/OrdersSubsTerminal';
import TradesSubsTerminal from './centrifuge/TradesSubsTerminal';

// Define centrifuge plugin
const centrifugePlugin = {

  cf: Centrifuge,
  subscriptions: new Map<string, Centrifuge.Subscription>(),

  // Plugin install
  install(vue: typeof Vue) {
    this.cf = new Centrifuge(`${process.env.VUE_APP_BACKEND_SOCKET_URI ? process.env.VUE_APP_BACKEND_SOCKET_URI : ''}/connection/websocket`);
    vue.$cf = this;
  },

  // Set authorization token
  SetToken(token: string): void {
    this.cf.setToken(token);
  },

  // Remove event listeners
  RemoveAllListeners(): void {
    this.cf.removeAllListeners();
  },

  // Add event listener
  On(event: string, listener: (...args: any[]) => void): void {
    this.cf.on(event, listener);
  },

  // Start connection
  Connect(): void {
    this.cf.connect();
  },

  // Remote procedure call
  async RPC(data: any) {
    const resp = await this.cf.rpc(data);
    // If error message
    if (resp.message) {
      throw resp.message;
    }
    return resp.data;
  },

  // Subscribe to channel
  // ignore if subscription exist
  Subscribe(channel: string, handler: (...args: any[]) => void) {
    if (!this.subscriptions.has(channel)) {
      const sub: Centrifuge.Subscription = this.cf.subscribe(channel, handler);
      this.subscriptions.set(channel, sub);
    }
  },

  // Unsubscribe from channel
  // ignore if subscription not exist
  Unsubscribe(channel: string) {
    const sub: Centrifuge.Subscription = this.subscriptions.get(channel);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(channel);
    }
  },

};

// Use in vue
Vue.use(centrifugePlugin);

declare module 'vue/types/vue' {
  interface VueConstructor {
    $cf: typeof centrifugePlugin;
  }
}



//////////////////////////////////////
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
  public tradesSubsTerminal = new TradesSubsTerminal();
  private id: string = '';
  constructor(url) {
    store.dispatch('app/centrifugeConnectedFlag', false);
    this.instance = new Centrifuge(url, {
      minRetry: 1000,
      maxRetry: 10000,
      onTransportClose: (ctx: any) => {
        if (store.state.auth.status.state) {
          eventBus.$emit('warn', `Trying reconnect! Error code: ${ctx.event.code}, Message: ${ctx.reason}`);
        }
      },
    });

    this.instance.on('connect', async (ctx) => {
      Vue.$log.debug(ctx);
      store.dispatch('app/centrifugeConnectedFlag', true);
    });

    this.instance.on('disconnect', (ctx) => {
      Vue.$log.error(`Disconnected: ${ctx}`);
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

  public async getAccountOrders(accountId) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetAccountOrders', params: { account: accountId } });
      this.ordersSubsTerminal.subscribe(this.instance, store, accountId, this.id);
      return (responseHandler(response)) ? response.data : 'error';
    }
  }

  public async getAccountTrades(accountId) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'GetAccountTrades', params: { account: accountId } });
      this.tradesSubsTerminal.subscribe(this.instance, store, accountId, this.id);
      return (responseHandler(response)) ? response.data : 'error';
    }
  }

  public async sendOrder(order) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'SendOrder', params: order });
      return (responseHandler(response)) ? response : 'error';
    }
  }

  public async cancelOrder(params) {
    if (store.state.app.centrifugeConnectedFlag) {
      const response = await this.instance.rpc({ method: 'CancelOrder', params: params });
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
