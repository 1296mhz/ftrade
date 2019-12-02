<template>
  <v-container fluid>
    <v-row>
      <v-col xs="12" sm="12" md="12" lg="12" xl="12">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="5" xl="5">
            <v-card height="100%">
              <v-container fluid>
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
                  single-select disable-sort fixed-header disable-pagination hide-default-footer @click:row="TestSelect">
                  <template v-slot:item.action="{ item }">
                    <v-icon small @click="DeleteSymbol(item.ticker)">mdi-close-box-outline</v-icon>
                  </template>
                </v-data-table>

              </v-container>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="8" lg="5" xl="5">
            <v-card height="100%">
              <v-container>
                <highcharts
                  class="stock"
                  :constructor-type="'stockChart'"
                  :options="stockOptions"
                  :callback="startCharts"
                  :highcharts="instance"
                ></highcharts>
              </v-container>
            </v-card>
          </v-col>

          <!-- New order form -->
          <v-col xs="12" sm="12" md="4" lg="2" xl="2">
            <v-card height="100%">
              <v-container fluid>
                <v-form ref="form" v-model="newOrder.valid" lazy-validation>
                  <v-row dense>
                    <v-col>
                      <v-text-field dense readonly label="Bid" outline />
                    </v-col>
                    <v-col>
                      <v-text-field dense readonly label="Ask" outline />
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col>
                      <v-select :items="['Limit', 'Market']" v-model="newOrder.type" dense></v-select>
                    </v-col>
                    <v-col>
                      <v-select :items="['Day','GTC']" v-model="newOrder.expiration" dense></v-select>
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
                      <v-btn small block :disabled="!newOrder.valid || !IsAccountSelected()" color="success" @click="SendOrder('buy')">Buy</v-btn>
                    </v-col>
                    <v-col class="ma-1">
                      <v-btn small block :disabled="!newOrder.valid || !IsAccountSelected()" color="error" @click="SendOrder('sell')">Sell</v-btn>
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
                        <v-icon v-if="IsCancelable(state)" small @click="cancelOrder({ account: getCurrentAccount.Id, order: item.id })">cancel</v-icon>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!-- Trades -->
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table :headers="tradesHeaders" :items="orders" item-key="id" height="300" dense disable-sort fixed-header disable-pagination hide-default-footer>
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
import Vue, { VueConstructor } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import { ISendOrder, IOrder, ITrade } from '../store/terminal/types';

stockInit(Highcharts);

export default (Vue as VueConstructor<any>).extend({
  data() {
    return {

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

      newOrder: {
        type: 'Limit',
        expiration: 'GTC',
        price: 0,
        volume: 1,

        valid: false,

        priceRules: [(v) => !!v || 'Price is required'],
        volumeRules: [(v) => !!v || 'Volume is required'],
      },


      chart: null,
      instance: Highcharts,
      selectedSymbolItem: {},
      ticker: '',
      volume: 1,
      volumeRules: [
        (v) => !!v || 'Volume is required',
        (v) => (v && v >= 1) || 'Volume cannot be less than one',
      ],
      price: 1,
      priceRules: [
        (v) => !!v || 'Price is required',
        (v) => (v && v >= 1) || 'Price cannot be less than one',
      ],
      side: '',
      validOrder: false,
      series: [],
      stockOptions: {
        chart: {
          type: 'candlestick',
          zoomType: 'x',
        },
        navigator: {
          id: 'navigator',
          enabled: true,
          adaptToUpdatedData: false,
          series: {
            data: [],
            type: 'areaspline',
            color: '#4572A7',
            fillOpacity: 0.05,
            dataGrouping: {
              smoothed: false,
            },
            lineWidth: 1,
            marker: {
              enabled: false,
            },
          },
          baseSeries: 0,
          xAxis: {},
        },
        scrollbar: {
          liveRedraw: false,
          enabled: false,
        },
        title: {
          text: 'Symbol not selected',
        },
        reflow: true,
        rangeSelector: {
          enabled: false,
          selected: 1,
          buttonTheme: {
            visibility: 'hidden',
          },
          labelStyle: {
            visibility: 'hidden',
          },
        },
        xAxis: {
          events: {
            setExtremes: this.setExtremes,
            afterSetExtremes: this.afterSetExtremes,
          },
          minRange: 60 * 1000,
        },
        yAxis: {
          floor: 0,
        },
        series: [
          {
            data: [],
            dataGrouping: {
              enabled: false,
            },
          },
        ],
      },
    };
  },
  watch: {
    // When you change the object of the $ router, each time we call to get the symbols (call function getSymbols)
    /*$route: {
      handler: function() {
        this.getSymbols();
        this.getOrders(this.getCurrentAccount.Id);
        this.getTrades(this.getCurrentAccount.Id);
      },
      immediate: true,
    },*/
    // We follow the object loadingSymbols its value will change false and
    // then we will begin to update the values of the components
    loadingSymbols(newVal: boolean) {
      if (!newVal) {
        Vue.$log.debug('Load symbols');
        if (this.symbols) {
          this.setSymbolSelected(this.symbols[0]);
        }
      }
    },
    // This is where the component updates when data changes.
    ohlc(newVal: any, oldVal: any) {
      this.chart = this.instance.charts[0];
      this.stockOptions.series[0].data = [null];
      this.stockOptions.series[0].data = newVal;
      this.chart.hideLoading();
    },
    // This is where the component updates when data changes.
    getOhlcNavigator(newVal: any, oldVal: any) {
      this.chart = this.instance.charts[0];
      this.stockOptions.navigator.series.data = [null];
      this.stockOptions.navigator.series.data = newVal;
      this.chart.xAxis[0].setExtremes();
    },
    // This is where the component updates when data changes.
    symbolSelected(newVal: any) {
      this.chart = this.instance.charts[0];
      this.stockOptions.navigator.series.data = [null];
      this.stockOptions.title.text = this.symbolSelected.ticker;
      Vue.$log.debug(`SymbolSelct ${this.symbolSelected.ticker}`);
      const ohlcParams = {
        ticker: this.symbolSelected.ticker,
        begin: 0,
        end: Vue.$constants.END_DATE_OHLC(),
      };
      this.setOhlcNavigator(ohlcParams);
      this.chart.showLoading('Loading data from server...');
    },
    getCurrentAccount(newVal: any) {
      Vue.$log.debug(`${newVal.Id}`);
      // this.setSymbolSelected(newVal.Id);
    },
  },
  computed: {
    ...mapGetters({
      symbols: 'symbols',

      tickers: 'terminal/TICKERS',
      positions: 'terminal/POSITIONS',
      trades: 'terminal/TRADES',
      ohlc: 'terminal/OHLC',
      getSymbolSelected: 'terminal/SYMBOL_SELECTED',
      loadingSymbols: 'terminal/LOADING_SYMBOLS',
      errorSymbols: 'terminal/ERROR_SYMBOLS',
      loadingText: 'terminal/LOADING_TEXT',
      getOhlcNavigator: 'terminal/OHLC_NAVIGATOR',
      currentSymbol: 'terminal/CURRENT_SYMBOL',
      getAccounts: 'app/ACCOUNTS',
      getCurrentAccount: 'app/CURRENT_ACCOUNT',
    }),

    // Orders table
    orders() {
      return this.$store.state.terminal.orders.map((order: IOrder) => {
        return {
          id: order.id,
          state: order.state,
          ticker: order.symbol,
          type: 'limit',  // TODO
          side: order.side,
          sideColor: (order.side === 'buy' ? 'green' : 'red'),
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
          ticker: trade.symbol,
          side: trade.side,
          sideColor: (trade.side === 'buy' ? 'green' : 'red'),
          price: trade.price.toLocaleString(),
          quantity: trade.volume,
          time: new Date(trade.time).toLocaleString() };
        });
    },

    symbolSelected: {
      get: function() {
        return this.getSymbolSelected;
      },
      set: function(newValue) {
        this.setSymbolSelected(newValue);
      },
    },
    accounts: {
      get: function() {
        return this.getAccounts;
      },
      set: () => {
        // this.setAccounts;
      },
    },
  },
  methods: {
    ...mapActions({
      getSymbols: 'terminal/symbols',
      getOrders: 'terminal/orders',
      getTrades: 'terminal/trades',
      setOhlc: 'terminal/ohlc',
      setSymbolSelected: 'terminal/setSymbolSelected',
      setOhlcNavigator: 'terminal/ohlcNavigator',
      setAccounts: 'app/accounts',
      sendOrder: 'terminal/sendOrder',
      cancelOrder: 'terminal/cancelOrder',
    }),
    TestSelect(item: any) {
      // console.log(item);
      this.selectedSymbols = [];
      this.selectedSymbols.push(item);
    },

    CreateSymbol(ticker: string) {
      this.$store.dispatch('CreateSymbol', ticker);
      this.ticker = '';
    },

    DeleteSymbol(ticker: string) {
      this.$store.dispatch('DeleteSymbol', ticker);
    },


    // Send order to router with selected account
    SendOrder(side: string) {
      const order = {
        account: this.$store.state.terminal.account,
        side: side,
        price: this.newOrder.price,
        volume: this.newOrder.volume,
        ticker: 'AMZN.NASDAQ',
      };
      this.$store.dispatch('SendOrder', order);
    },

    // Test is order cancelable
    IsCancelable(state: string): boolean {
      return state === 'open' || state === 'partially filled';
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
        return this.$store.state.terminal.account !== '';
    },

    setExtremes(params: any) {
      Vue.$log.debug(params);
      this.chart = this.instance.charts[0];
      this.chart.showLoading('Loading data from server...');
      const ohlcParams = {
        ticker: this.symbolSelected.ticker,
        begin: params.min,
        end: params.max,
      };

      this.setOhlc(ohlcParams);
    },
    startCharts() {
      Vue.$log.debug(`Start chart!`);
    },
    selectSymbol(item) {
      this.setSymbolSelected(item);
    },
    // cancelOrder(orderId) {
    //   const cOrder = {
    //     account: this.getCurrentAccount.Id,
    //     order: orderId,
    //   }
    //   Vue.$log.debug(`Cancel order: ${orderId}`)
    // },
  },
  async created() {
    await this.$store.dispatch('GetSymbols');
    await this.$store.dispatch('SubscribeSymbols');
    // this.getSymbols();
    // this.getOrders(this.getCurrentAccount.Id);
  },
  beforeDestroy() {
    this.$store.dispatch('UnsubscribeSymbols');
    if (this.instance.charts[0] !== undefined) {
      this.instance.charts[0].destroy();
      this.instance.charts.splice(0, 1);
    }
  },
});
</script>