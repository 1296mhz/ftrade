import Vue from 'vue';

// Subscribe and unsubscribe from characters
export default class SymbolSubsTerminal {
  private symbols: any[] = [];
  public subscribe(instance, store, message) {
    const symbol = instance.subscribe(`symbols:${message.data.Params.ticker}`, (newMessage) => {
      newMessage.data.ticker = message.data.Params.ticker;
      if (newMessage.data.ask) {
        store.dispatch('terminal/setAskSymbol', newMessage);
      }
      if (newMessage.data.bid) {
        store.dispatch('terminal/setBidSymbol', newMessage);
      }
    });

    this.symbols.push(symbol);
  }
  public subscribeMassive(instance, store, response) {
    this.symbols = response.map((symbol) => {
       return instance.subscribe(`symbols:${symbol.ticker}`, (newMessage) => {
        newMessage.data.ticker = symbol.ticker;
        if (newMessage.data.ask) {
          store.dispatch('terminal/setAskSymbol', newMessage);
        }
        if (newMessage.data.bid) {
          store.dispatch('terminal/setBidSymbol', newMessage);
        }
       });
    });
  }
  public unsubscribe(message) {
    const index = Vue.$_.findIndex(this.symbols, (symbol: any) => symbol.channel === `symbols:${message.data.Params}` );
    this.symbols[index].unsubscribe();
    this.symbols.splice(index, 1);
  }
}
