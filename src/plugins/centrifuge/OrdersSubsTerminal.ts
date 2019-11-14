import Vue from 'vue';

// Subscribe and unsubscribe from characters
export default class OrdersSubsTerminal {
  private orders = null;
  public subscribe(instance, store, accountId, userId) {
    if (this.orders !== null) {
      if (this.orders.channel !== `orders#${accountId}#${userId}`) {
        this.orders.unsubscribe();
        this.orders = null;
      }
    }
    this.orders = instance.subscribe(`orders#${accountId}#${userId}`, (newMessage) => {
      Vue.$log.debug(`Orders: ${newMessage}`);
    });
  }
  public unsubscribe() {
    (this.orders != null) ? this.orders.unsubscribe() : this.getSubscribeChannel();
    this.orders = null;
  }
  public getSubscribeChannel() {
    return (this.orders !== null) ? this.orders.channel : false;
  }
}
