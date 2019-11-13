import Vue from 'vue';

// Subscribe and unsubscribe from characters
export default class OrdersSubsTerminal {
  private orders = {};
  public subscribe(instance, store, accountId, userId) {
    const orders = instance.subscribe(`orders#${accountId}#${userId}`, (newMessage) => {
    });
  }
}
