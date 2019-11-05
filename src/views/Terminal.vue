<template>
  <v-container fluid>
    <v-row>
      <v-col xs="12" sm="12" md="8" lg="10" xl="10">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="6" xl="6">
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
                <v-data-table
                  v-model="symbolSelected"
                  :headers="symbol_headers"
                  :items="symbols"
                  :items-per-page="5"
                  class="elevation-0"
                  item-key="ticker"
                  height="300"
                  fixed-header
                  disable-pagination
                  hide-default-footer
                  dense
                  :loading="loadingSymbols"
                  loading-text="Loading... Please wait"
                  single-select
                  show-select
                  single-expand
                >
                  <template v-slot:item.actions="{ item }">
                    <v-icon small @click="deleteSymbol(item.ticker)">delete</v-icon>
                  </template>
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="12" lg="6" xl="6">
            <v-card height="100%">
              <v-container fluid>
                <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
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

                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table
                      dense
                      height="300"
                      :headers="position_headers"
                      :items="positions"
                      item-key="id"
                      fixed-header
                      disable-pagination
                      hide-default-footer
                    ></v-data-table>
                  </v-tab-item>
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table dense :headers="order_headers" :items="orders" item-key="id">
                      <template v-slot:item.state="{ item }">
                        <v-chip color="green" dark label x-small>{{ item.state }}</v-chip>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table
                      dense
                      :headers="position_headers"
                      :items="positions"
                      item-key="id"
                    ></v-data-table>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col xs="12" sm="12" md="4" lg="2" xl="2">
        <v-row xs="12" sm="12" md="4" lg="2" xl="2">
          <v-col>
            <v-card>
              <v-form ref="form" lazy-validation>
                <v-container fluid height="100vh">
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
                      <v-select dense :items="['Limit','Market']" value="Limit"></v-select>
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
                    <v-col class="ma-1">
                      <v-btn small block color="success">Buy</v-btn>
                    </v-col>
                    <v-col class="ma-1">
                      <v-btn small block color="error">Sell</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <v-row xs="12" sm="12" md="4" lg="2" xl="2">
          <v-col>
            <v-card>
              <v-container fluid>
                <v-card-title>Prices</v-card-title>
                <v-card-text>I'm card text</v-card-text>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  data() {
    return {
      ticker: '',
      amount: '',
      price: '',
      series: [],
      symbol_headers: [
        {
          text: 'Ticker',
          align: 'left',
          sortable: false,
          value: 'ticker',
        },
        {
          text: 'Bid',
          align: 'left',
          sortable: false,
          value: 'bid',
        },
        {
          text: 'Ask',
          align: 'left',
          sortable: false,
          value: 'ask',
        },
        {
          text: 'Actions',
          align: 'left',
          sortable: false,
          value: 'actions',
        },
      ],
      order_headers: [
        { text: 'State', value: 'state' },
        { text: 'Ticker', value: 'ticker' },
        { text: 'Type', value: 'type' },
        { text: 'Side', value: 'side' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Time', value: 'time' },
      ],
      position_headers: [
        { text: 'Ticker', value: 'ticker' },
        { text: 'Position', value: 'position' },
        { text: 'Avg.Price', value: 'avgprice' },
        { text: 'Price', value: 'price' },
        { text: 'P&L', value: 'pnl' },
      ],
      stockOptions: {
        chart: {
          type: 'candlestick',
          zoomType: 'x',
        },
        navigator: {
          adaptToUpdatedData: false,
          series: {
            data: [],
          },
        },
        scrollbar: {
          liveRedraw: false,
        },
        title: {
          text: 'Symbol not selected',
        },
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
            afterSetExtremes: this.afterSetExtremes,
          },
          minRange: 3600 * 1000, // one hour
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
    $route: {
      handler: function() {
        this.getSymbols();
      },
      immediate: true,
    },
    // We follow the object loadingSymbols its value will change false and then we will begin to update the values of the components
    loadingSymbols(newVal: boolean) {
      if (!newVal) {
        this.setSymbolSelected(this.symbols);
      }
    },
    //This is where the component updates when data changes.
    ohlc(newVal: any) {
      this.stockOptions.series[0].data = newVal;
    },
    //This is where the component updates when data changes.
    getOhlcNavigator(newVal: any, oldVal: any) {
      this.stockOptions.navigator.series.data = newVal;
    },
    //This is where the component updates when data changes.
    symbolSelected(newVal: any) {
      this.stockOptions.navigator.series.data = [];
      this.stockOptions.title.text = this.symbolSelected[0].ticker;
      Vue.$log.debug(`SymbolSelct ${this.symbolSelected[0].ticker}`);
      const ohlcParams = {
        ticker: this.symbolSelected[0].ticker,
        begin: 0,
        end: Vue.$constants.END_DATE_OHLC(),
      };
      this.setOhlcNavigator(ohlcParams);
    },
  },
  computed: {
    ...mapGetters({
      symbols: 'terminal/SYMBOLS',
      tickers: 'terminal/TICKERS',
      positions: 'terminal/POSITIONS',
      orders: 'terminal/ORDERS',
      ohlc: 'terminal/OHLC',
      getSymbolSelected: 'terminal/SYMBOL_SELECTED',
      loadingSymbols: 'terminal/LOADING_SYMBOLS',
      errorSymbols: 'terminal/ERROR_SYMBOLS',
      loadingText: 'terminal/LOADING_TEXT',
      getOhlcNavigator: 'terminal/OHLC_NAVIGATOR',
    }),
    symbolSelected: {
      get: function() {
        return this.getSymbolSelected;
      },
      set: function(newValue) {
        this.setSymbolSelected(newValue);
      },
    },
  },
  methods: {
    ...mapActions({
      getSymbols: 'terminal/symbols',
      createSymbol: 'terminal/createSymbol',
      deleteSymbol: 'terminal/deleteSymbol',
      setOhlc: 'terminal/ohlc',
      setSymbolSelected: 'terminal/setSymbolSelected',
      setOhlcNavigator: 'terminal/ohlcNavigator',
    }),
    CreateSymbol(ticker) {
      this.createSymbol(ticker);
      this.ticker = '';
    },
    afterSetExtremes(params) {
      Vue.$log.debug(params);
      if (this.stockOptions.series[0].data.length === 0) {
        console.log('FILLING');
        const ohlcParams = {
          ticker: this.symbolSelected[0].ticker,
          begin: Math.round(params.min),
          end: Math.round(params.max),
        };
        this.setOhlc(ohlcParams);
      }
      if (params.type === 'setExtremes') {
      }
    },
  },
  created() {
    this.getSymbols();
  },
});
</script>

<style scoped lang="css">
.back {
  background-color: white;
  display: inline-block;
  position: relative;
  height: 100%;
}
</style>