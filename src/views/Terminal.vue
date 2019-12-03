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
      getOhlcNavigator: 'terminal/OHLC_NAVIGATOR',
    }),

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
          ticker: order.symbol,
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
          ticker: trade.symbol,
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
    ...mapActions({
      setOhlc: 'terminal/ohlc',
      setSymbolSelected: 'terminal/setSymbolSelected',
      setOhlcNavigator: 'terminal/ohlcNavigator',
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

    // Can send order?
    IsSendAvailable(): boolean {
      return this.newOrder.valid && this.$store.state.terminal.account !== '' && this.selectedSymbols.length > 0;
    },

    // Send order to router with selected account
    SendOrder(side: string) {
      const order = {
        account: this.$store.state.terminal.account,
        side: side,
        price: this.newOrder.price,
        volume: this.newOrder.volume,
        ticker: this.newOrder.ticker,
      };
      this.$store.dispatch('SendOrder', order);
    },

    // Test is order cancelable
    IsCancelable(state: string): boolean {
      return state === 'open' || state === 'partially filled';
    },

    // Cancel order
    CancelOrder(order: string) {
      const payload = {
        account: this.$store.state.terminal.account,
        order: order,
      };
      this.$store.dispatch('CancelOrder', payload);
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

  },

  async created() {
    await this.$store.dispatch('GetSymbols');
    await this.$store.dispatch('SubscribeSymbols');
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