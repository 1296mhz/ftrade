<template>
  <v-container fluid>
    <v-row>
      <v-col xs="12" sm="12" md="12" lg="12" xl="12">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="5" xl="5">
            <v-card height="100%">
              <v-container fluid>

                <!-- Symbols -->
                <v-row align="center" justify="start">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="CreateSymbol(ticker)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-text-field v-model="ticker" label="Ticker" name="ticker" type="text"></v-text-field>
                  </v-card-actions>
                </v-row>

                <v-data-table dense height="300" :headers="symbolsHeaders" :items="symbols" item-key="ticker" v-model="selectedSymbols"
                  single-select disable-sort fixed-header disable-pagination hide-default-footer @click:row="SelectSymbol">
                  <template v-slot:item.action="{ item }">
                    <v-icon small @click="DeleteSymbol(item.ticker)">cancel</v-icon>
                  </template>
                </v-data-table>

              </v-container>
            </v-card>
          </v-col>

          <!-- Chart -->
          <v-col xs="12" sm="12" md="8" lg="5" xl="5">
            <v-card height="100%">
              <v-container>
                <highcharts ref="OhlcChart" class="stock" :constructor-type="'stockChart'" :options="chartOptions"></highcharts>
              </v-container>
            </v-card>
          </v-col>

          <!-- New order form -->
          <v-col xs="12" sm="12" md="4" lg="2" xl="2">
            <v-card height="100%">
              <v-container fluid>
                <v-form ref="form" v-model="newOrder.valid" lazy-validation>
                  <v-row dense>
                    <v-text-field label="Symbol" :value="selectedSymbol.ticker" dense readonly outline/>
                  </v-row>

                  <v-row dense>
                    <v-col>
                      <v-text-field label="Bid" :value="selectedSymbol.bid" dense readonly outline/>
                    </v-col>
                    <v-col>
                      <v-text-field label="Ask" :value="selectedSymbol.ask" dense readonly outline/>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col>
                      <v-select label="Type" :items="['Limit', 'Market']" v-model="newOrder.type" dense></v-select>
                    </v-col>
                    <v-col>
                      <v-select label="Expiration" :items="['Day','GTC']" v-model="newOrder.expiration" dense></v-select>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col> 
                      <v-text-field dense v-model.number="newOrder.price" label="Price" :rules="newOrder.priceRules"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field dense v-model.number="newOrder.volume" label="Volume" :rules="newOrder.volumeRules"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col class="ma-1">
                      <v-btn small block :disabled="!IsSendAvailable()" color="success" @click="SendOrder('buy')">Buy</v-btn>
                    </v-col>
                    <v-col class="ma-1">
                      <v-btn small block :disabled="!IsSendAvailable()" color="error" @click="SendOrder('sell')">Sell</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card>
          </v-col>

        </v-row>
        <v-row>
          <v-col>
            <v-card height="100%">
              <v-container fluid>
                <v-tabs height="45">
                  <v-tab>Positions</v-tab>
                  <v-tab>Orders</v-tab>
                  <v-tab>Trades</v-tab>

                  <!-- Positions -->
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table :headers="positionsHeaders" :items="positions" item-key="id" dense height="300" fixed-header disable-pagination hide-default-footer></v-data-table>
                  </v-tab-item>

                  <!-- Orders -->
                  <v-tab-item transition="none" reverse-transition="none">  
                    <v-data-table :headers="ordersHeaders" :items="orders" item-key="id" height="300" dense disable-sort fixed-header disable-pagination hide-default-footer>
                      <template v-slot:item.state="{item: {state}}">
                        <v-chip :color="GetStateColor(state)" dark label x-small>{{state}}</v-chip>
                      </template>
                      <template v-slot:item.side="{item: {side}}">
                        <v-chip :color="GetSideColor(side)" label x-small outlined>{{side}}</v-chip>
                      </template>
                      <template v-slot:item.action="{item: {id, state}}">
                        <v-icon v-if="IsCancelable(state)" small @click="CancelOrder(id)">cancel</v-icon>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!-- Trades -->
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table :headers="tradesHeaders" :items="trades" item-key="id" height="300" dense disable-sort fixed-header disable-pagination hide-default-footer>
                      <template v-slot:item.side="{item: {side}}">
                        <v-chip :color="GetSideColor(side)" label x-small outlined>{{side}}</v-chip>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                </v-tabs>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
<<<<<<< HEAD
import axios from 'axios';
import centrifuge from 'centrifuge';
=======
>>>>>>> Demo
import Vue from 'vue';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import { IOrder, ITrade} from '@/store/types';

stockInit(Highcharts);
Vue.use(HighchartsVue);

let cf: centrifuge;

export default Vue.extend({
  data() {
    return {
<<<<<<< HEAD
      amount: 'asd',
      user_symbols: null,
=======
>>>>>>> Demo

      ticker: '', // ???? Remove

      // Symbols table
      symbolsHeaders: [
        {text: 'Ticker', value: 'ticker'},
        {text: 'Bid', value: 'bid'},
        {text: 'Ask', value: 'ask'},
        {text: 'Action', value: 'action'},
      ],

      selectedSymbols: [],

      // Positions table
      positionsHeaders: [
        {text: 'Ticker', value: 'ticker'},
        {text: 'Position', value: 'position'},
        {text: 'Avg.Price', value: 'avgprice'},
        {text: 'Price', value: 'price'},
        {text: 'P&L', value: 'pnl'},
      ],

      // Orders table
      ordersHeaders: [
        {text: 'Time', value: 'time'},
        {text: 'State', value: 'state'},
        {text: 'Type', value: 'type'},
        {text: 'Ticker', value: 'ticker'},
        {text: 'Side', value: 'side'},
        {text: 'Price', value: 'price'},
        {text: 'Quantity', value: 'quantity'},
        {text: 'Action', value: 'action'},
      ],

      // Trades table
      tradesHeaders: [
        {text: 'Time', value: 'time'},
        {text: 'Ticker', value: 'ticker'},
        {text: 'Side', value: 'side'},
        {text: 'Price', value: 'price'},
        {text: 'Quantity', value: 'quantity'},
      ],

      // New order data
      newOrder: {
        type: 'Limit',
        expiration: 'GTC',
        price: 0,
        volume: 1,

        valid: false,

        priceRules: [(v) => !!v || 'Price is required'],
        volumeRules: [(v) => !!v || 'Volume is required'],
      },

      // OHLC chart options
      chartOptions: {
        chart: {
          type: 'candlestick',
          zoomType: 'x',
          animation: false,
        },
        navigator: {
          adaptToUpdatedData: false,
          series: {},
        },
        scrollbar: {
          enabled: false,
        },
        title: {
          text: 'Symbol not selected',
        },
        rangeSelector: {
          enabled: false,
        },
        xAxis: {
          events: {
            // setExtremes: this.setExtremes,
            // afterSetExtremes: this.afterSetExtremes,
          },
          minRange: 60 * 1000,
        },
        yAxis: {
          // floor: 0,
        },
        series: [{
            dataGrouping: {
              enabled: false,
            },
          },
        ],
        credits: {
          enabled: false,
        },
      },
    };
  },

  computed: {
    // Symbols table
    symbols() {
      return this.$store.state.terminal.symbols;
    },

    // Positions table
    positions() {
      return [];  // TODO
    },

    // Orders table
    orders() {
      return this.$store.state.terminal.orders.map((order: IOrder) => {
        return {
          id: order.id,
          state: order.state,
          ticker: order.ticker,
          type: 'limit',  // TODO
          side: order.side,
          price: order.price.toLocaleString(),
          quantity: order.volume,
          time: new Date(order.time).toLocaleString() };
        });
    },

    // Trades table
    trades() {
      return this.$store.state.terminal.trades.map((trade: ITrade) => {
        return {
          id: trade.id,
          ticker: trade.ticker,
          side: trade.side,
          price: trade.price.toLocaleString(),
          quantity: trade.volume,
          time: new Date(trade.time).toLocaleString() };
        });
    },

    // Selected symbol
    selectedSymbol() {
      return this.selectedSymbols.length > 0 ? this.selectedSymbols[0] : {};
    },
  },

  methods: {
<<<<<<< HEAD
    deleteItem(item: any) {
      const index = this.symbols.indexOf(item);

      cf.rpc({method: 'DeleteSymbol', params: this.symbols[index].ticker});

      //this.symbols.splice(index, 1);
      /*this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''*/
    },
  },

  mounted() {
    console.log('mounted');

    cf = new centrifuge('ws://localhost:8090/connection/websocket');

    axios.get('http://localhost:8090/auth?user=user&pass=pass')
      .then((response) => {
        cf.setToken(response.data);

        cf.on('connect', (ctx) => {
            // drawText('Connected over ' + ctx.transport);

            cf.rpc({method: 'GetSymbols'})
            .then((res) => {
              this.symbols = res.data;
            }, (err) => {
              console.log('rpc error', err);
            });

        });
        cf.on('disconnect', (ctx) => {
            // drawText('Disconnected: ' + ctx.reason);
        });
        const sub = cf.subscribe('symbols#id', (message) => {
            // drawText(JSON.stringify(message));
            console.log('symbols ', message);
        });
        cf.connect();
      });
=======
    // Select current symbol
    async SelectSymbol(symbol: any) {
      this.selectedSymbols = [];
      this.selectedSymbols.push(symbol);

      // Update chart
      const data = await this.$store.dispatch('terminal/GetOhlc', {
        ticker: symbol.ticker,
        interval: 86400,
        begin: 0,
        end: 5000000000000});

      this.chartOptions.navigator.series.data = data;
      this.chartOptions.series[0].data = data;
      this.chartOptions.title.text = symbol.ticker;

      const chart = this.$refs.OhlcChart.chart;
      chart.xAxis[0].setExtremes();
    },

    // Create symbol in symbol table
    CreateSymbol(ticker: string) {
      this.$store.dispatch('terminal/CreateSymbol', ticker);
      this.ticker = '';
    },

    // Delete symbol from symbol table
    DeleteSymbol(ticker: string) {
      this.$store.dispatch('terminal/DeleteSymbol', ticker);
    },

    // Can send order?
    IsSendAvailable(): boolean {
      return this.newOrder.valid && this.$store.state.terminal.vaccount !== '' && this.selectedSymbols.length > 0;
    },

    // Send order to router with selected account
    SendOrder(side: string) {
      const order = {
        account: this.$store.state.terminal.vaccount,
        side: side,
        price: this.newOrder.price,
        volume: this.newOrder.volume,
        ticker: this.selectedSymbol.ticker,
      };
      this.$store.dispatch('terminal/SendOrder', order);
    },

    // Test is order cancelable
    IsCancelable(state: string): boolean {
      return state === 'open' || state === 'partially filled';
    },

    // Cancel order
    CancelOrder(order: string) {
      const payload = {
        account: this.$store.state.terminal.vaccount,
        order: order,
      };
      this.$store.dispatch('terminal/CancelOrder', payload);
    },

    // Order state color
    GetStateColor(state: string) {
        let сolor = 'amber';
        switch (state) {
          case 'open':  сolor = 'green'; break;
          case 'partially filled': сolor = 'green'; break;
          case 'filled':  сolor = 'blue'; break;
          case 'rejected':  сolor = 'red'; break;
          case 'canceled':  сolor = 'grey'; break;
        }
        return сolor;
    },

    // Side color
    GetSideColor(side: string) {
      return side === 'buy' ? 'green' : 'red';
    },

    // Test current account
    IsAccountSelected() {
        return this.$store.state.terminal.vaccount !== '';
    },
  },

  // Hooks
  async created() {
    await this.$store.dispatch('terminal/GetVAccounts');
    await this.$store.dispatch('terminal/GetSymbols');
    await this.$store.dispatch('terminal/SubscribeSymbols');
>>>>>>> Demo
  },

  beforeDestroy() {
    this.$store.dispatch('terminal/UnsubscribeSymbols');
  },

});
</script>