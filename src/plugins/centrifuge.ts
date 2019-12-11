import Vue from 'vue';
import Centrifuge from 'centrifuge';

// Define centrifuge plugin
const centrifugePlugin = {

  cf: Centrifuge,
  subscriptions: new Map<string, Centrifuge.Subscription>(),

  // Plugin install
  install(vue: typeof Vue) {
    this.cf = new Centrifuge(`${process.env.VUE_APP_BACKEND_SOCKET_URI ? process.env.VUE_APP_BACKEND_SOCKET_URI : `wss://${location.hostname}`}/connection/websocket`);
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

  Disconnect(): void {
    this.cf.disconnect();
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
      sub.removeAllListeners();
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
