import Vue from 'vue';

// Subscribe and unsubscribe from characters
export default class TradesSubsTerminal {
  private trades = null;
  public subscribe(instance, store, accountId, userId) {
    if (this.trades !== null) {
      if (this.trades.channel !== `trades#${accountId}#${userId}`) {
        this.trades.unsubscribe();
        this.trades = null;
      }
    }
    this.trades = instance.subscribe(`trades#${accountId}#${userId}`, (newMessage) => {
      Vue.$log.debug(`Trades: ${newMessage}`);
    });
  }
  public unsubscribe() {
    (this.trades != null) ? this.trades.unsubscribe() : this.getSubscribeChannel();
    this.trades = null;
  }
  public getSubscribeChannel() {
    return (this.trades !== null) ? this.trades.channel : false;
  }
}
