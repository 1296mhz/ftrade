<template>
  <v-container>
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

      <v-col cols="4">

        <v-form ref="form" lazy-validation>
          <v-container>
            <v-row dense>
              <v-col>
                <v-text-field dense disabled label="Bid" outline />
              </v-col>
              <v-col>
                <v-text-field dense disabled label="Ask" outline />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                <v-select dense :items="['Limit','Market']" value="Limit">

                </v-select>
              </v-col>            
              <v-col>
                <v-select dense :items="['Day','GTC']" value="Day"></v-select>
              </v-col>            
            </v-row>

            <v-row dense>
              <v-col>
                <v-text-field dense v-model="amount" label="Amount" required></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense v-model="price" label="Price" required></v-text-field>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-btn small @click="handlerBuy" block color="success">Buy</v-btn>
              </v-col>
              <v-col>
                <v-btn small @click="handlerSell" block color="error">Sell</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

      </v-col>

    </v-row>

    <v-row>
      <v-col cols="6">
        <v-tabs height="35">
          <v-tab>Positions</v-tab>
          <v-tab>Orders</v-tab>
          <v-tab>Trades</v-tab>
          
          <v-tab-item transition="none" reverse-transition="none">
            <v-data-table dense height="300" :headers="position_headers" :items="positions" item-key="id"  fixed-header disable-pagination hide-default-footer></v-data-table>
          </v-tab-item>

          <v-tab-item transition="none" reverse-transition="none">
            <v-data-table dense :headers="order_headers" :items="orders" item-key="id">
              <template v-slot:item.state="{ item }">
                <v-chip color="green" dark label x-small>{{ item.state }}</v-chip>
<!--                 <div class="green text-center">
                  <span class="white--text">{{ item.state }}</span>
                </div>
 -->              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item transition="none"  reverse-transition="none">
            <v-data-table dense :headers="position_headers" :items="positions" item-key="id"></v-data-table>
          </v-tab-item>



        </v-tabs>      
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
export default {
  data() {
    // Generate positions
    const ipos = [];
    const tickers: string[] = ['AAPL.NASDAQ', 'AMZN.NASDAQ', 'GOOG.NASDAQ', 'EUR/USD.E.FX', 'USD/JPY.E.FX', 'GBP/USD.E.FX'];

    for (let i = 0; i < 100; ++i) {
      ipos[i] = {
          id: i,
          ticker: tickers[Math.floor(Math.random() * tickers.length)],
          position: Math.floor(Math.random() * 100) + 1,
          avgprice: (Math.random() * 100 + 10).toFixed(2),
          price: (Math.random() * 100 + 10).toFixed(2),
          pnl: (Math.random() * 100 + 10).toFixed(2),
      };
    }

    return {
      order_headers: [
        {text: 'State', value: 'state'},
        {text: 'Ticker', value: 'ticker'},
        {text: 'Type', value: 'type'},
        {text: 'Side', value: 'side'},
        {text: 'Quantity', value: 'quantity'},
        {text: 'Time', value: 'time'},
      ],

      orders: [
        {
          id: '0001',
          state: 'open',
          ticker: 'EUR/USD.E.FX',
          type: 'limit',
          side: 'buy',
          quantity: 10,
          time: new Date(2017, 4, 4, 17, 23, 42, 11).toLocaleString(),
        },
      ],

      position_headers: [
        {text: 'Ticker', value: 'ticker'},
        {text: 'Position', value: 'position'},
        {text: 'Avg.Price', value: 'avgprice'},
        {text: 'Price', value: 'price'},
        {text: 'P&L', value: 'pnl'},
      ],

      positions: ipos,

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