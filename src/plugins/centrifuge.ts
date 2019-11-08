import Vue from 'vue';
import centrifuge from 'centrifuge';
import store from '../store';
import { IOhlcParams } from '../store/terminal/types';
import { eventBus } from '../main';

function responseHandler(response) {
  Vue.$log.debug(response);
  if (response.code) {
    eventBus.$emit('error', `Error code: ${response.code}, Message: ${response.message}`);
    return false;
  } else {
    return true;
  }
}

// Subscribe and unsubscribe from characters
class SymbolSubs{
  symbols: Array<any> = [];
  public subscribe(instance, store, message) {
    let symbol = instance.subscribe(`symbols:${message.data.Params.ticker}`, (newMessage) => {
      newMessage.data.ticker = message.data.Params.ticker;
      if (newMessage.data.ask) {
        store.dispatch('terminal/setAskSymbol', newMessage);
      };
      if (newMessage.data.bid) {
        store.dispatch('terminal/setBidSymbol', newMessage);
      };
    });

    this.symbols.push(symbol);
  }
  public subscribeMassive(instance, store, response) {
    this.symbols = response.map((symbol) => {
       return instance.subscribe(`symbols:${symbol.ticker}`, (newMessage) => {
        newMessage.data.ticker = symbol.ticker;
        if (newMessage.data.ask) {
          store.dispatch('terminal/setAskSymbol', newMessage);
        };
        if (newMessage.data.bid) {
          store.dispatch('terminal/setBidSymbol', newMessage);
        };
       });
    });
  }
  public unsubscribe(message) {
    const index = Vue.$_.findIndex(this.symbols, (symbol: any) => { symbol.channel === `symbols:${message.data.Params}`; });
    this.symbols[index].unsubscribe();
    this.symbols.splice(index, 1);
  }

}
class CentrifugeManager {
  public instance: any;
  public symbolSubscribes = new SymbolSubs();
  private id: string = '';
  private connectFlag: boolean = false;
  constructor(url) {
    this.instance = new centrifuge(url);

    this.instance.on('connect', async (ctx) => {
      this.instance.removeAllListeners();
      this.connectFlag = true;

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
      Vue.$log.error(`Error: ${ctx}`);
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
      this.symbolSubscribes.subscribeMassive(this.instance, store, response.data);
      return (responseHandler(response)) ? response.data : 'error';
    }
  }

  public async createSymbol(ticker: string) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'CreateSymbol', params: { ticker: ticker } });
      return (responseHandler(response)) ? response : 'error';
    }
  }

  public async deleteSymbol(ticker: string) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'DeleteSymbol', params: ticker });
      return (responseHandler(response)) ? response : 'error';
    }
  }

  public async getOhlc(params: IOhlcParams) {
    if (this.connectFlag) {
      const response = await this.instance.rpc({ method: 'GetOhlc', params: params });
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
