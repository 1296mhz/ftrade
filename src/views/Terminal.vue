<template>
  <v-container fluid>
     <v-row>
    <v-row>
      <v-col cols="4">
    
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Bid</th>
                <th>Ask</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="symbol in symbols" :key="symbol.ticker">
                <td><v-icon small :color="symbol.color">mdi-circle</v-icon> {{ symbol.ticker }}</td>
                <td>{{ symbol.bid }}</td>
                <td>{{ symbol.ask }}</td>
                <td><v-icon small @click="deleteItem(symbol)">mdi-close-box-outline</v-icon></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

      </v-col>
    </v-row>

    <v-row align="stretch">
      <v-col>
        <v-tabs height="35">
          <v-tab>Positions</v-tab>
          <v-tab>Orders</v-tab>
          <v-tab>Trades</v-tab>
          
          <v-tab-item transition="none" reverse-transition="none">
            <v-data-table dense :headers="position_headers" :items="positions" item-key="ticker"  fixed-header disable-pagination hide-default-footer></v-data-table>
          </v-tab-item>

          <v-tab-item transition="none" reverse-transition="none">
            Orders
          </v-tab-item>

          <v-tab-item transition="none"  reverse-transition="none">
            <v-data-table dense :headers="position_headers" :items="positions" item-key="ticker" class="elevation-1"></v-data-table>
          </v-tab-item>



        </v-tabs>      
      </v-col>
    </v-row>
     </v-row>
  </v-container>
</template>


<script lang="ts">
export default {
  data() {
    return {
      position_headers: [
        {text: 'Ticker', value: 'ticker'},
        {text: 'Position', value: 'position'},
        {text: 'Avg.Price', value: 'avgprice'},
        {text: 'Price', value: 'price'},
        {text: 'P&L', value: 'pnl'},
      ],

      positions: [
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
        {
          ticker: 'AAPL.NASDAQ',
          position: 50,
          avgprice: 210,
          price: 233,
          pnl: 100,
        },
      ],

      symbols: [
        {
          ticker: 'EUR/USD.E.FX',
          color: 'orange darken-1',
          bid: 1.104,
          ask: 1.105,
        },
        {
          ticker: 'USD/JPY.E.FX',
          color: 'orange darken-1',
          bid: 108.34,
          ask: 108.36,
        },
        {
          ticker: 'GBP/USD.E.FX',
          color: 'orange darken-1',
          bid: 1.266,
          ask: 1.268,
        },
        {
          ticker: 'AAPL.NASDAQ',
          color: 'blue darken-1',
          bid: 233.12,
          ask: 233.15,
        },
        {
          ticker: 'AMZN.NASDAQ',
          color: 'blue darken-1',
          bid: 1742.50,
          ask: 1747.15,
        },
        {
          ticker: 'GOOG.NASDAQ',
          color: 'blue darken-1',
          bid: 1222.50,
          ask: 1225.00,
        },
        {
          ticker: 'BTC.EXANTE',
          color: 'purple  darken-1',
          bid: 8338,
          ask: 8400,
        },
        {
          ticker: 'LTC.EXANTE',
          color: 'purple  darken-1',
          bid: 56.50,
          ask: 57.50,
        },
        {
          ticker: 'ETH.EXANTE',
          color: 'purple  darken-1',
          bid: 183.30,
          ask: 184.50,
        },
      ],
    };
  },
};
</script>