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
      symbolSelected: [],
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
        title: {
          text: '',
        },
        xAxis: {
          events: {
            afterSetExtremes: this.afterSetExtremesBand,
          },
          minRange: 3600 * 1000, // one hour
        },
        series: [
          {
            type: 'candlestick',
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    $route: {
      handler: function() {
        this.getSymbols();
      },
      immediate: true,
    },
    loadingSymbols(newVal: boolean) {
      if (!newVal) {
        this.symbolSelected = [];
        this.setSymbolSelectedState(this.symbols[0]);
        this.symbolSelected.push(this.symbolSelectedState);
        this.stockOptions.title.text = this.symbolSelected[0].ticker;
      }
    },
    symbols(newVal: any) {},
    ohlc(newVal: any) {
      this.stockOptions.series = newVal;
    },
    symbolSelected(newWal: any) {
      this.setSymbolSelectedState(this.symbolSelected);
      const currentDate = new Date();
      const ohlcParams = {
        ticker: this.symbolSelected[0].ticker,
        interval: 'd',
        begin: 0,
        end: currentDate.getTime(),
      };
      this.stockOptions.title.text = this.symbolSelected[0].ticker;
      this.getOhlc(ohlcParams);
    },
  },
  computed: {
    ...mapGetters({
      symbols: 'terminal/SYMBOLS',
      tickers: 'terminal/TICKERS',
      positions: 'terminal/POSITIONS',
      orders: 'terminal/ORDERS',
      ohlc: 'terminal/OHLC',
      symbolSelectedState: 'terminal/SYMBOL_SELECTED',
      loadingSymbols: 'terminal/LOADING_SYMBOLS',
      errorSymbols: 'terminal/ERROR_SYMBOLS',
      loadingText: 'terminal/LOADING_TEXT',
    }),
  },
  methods: {
    ...mapActions({
      getSymbols: 'terminal/symbols',
      createSymbol: 'terminal/createSymbol',
      deleteSymbol: 'terminal/deleteSymbol',
      getOhlc: 'terminal/getOhlc',
      setSymbolSelectedState: 'terminal/setSymbolSelected',
    }),
    CreateSymbol(ticker) {
      this.createSymbol(ticker);
      this.ticker = '';
    },
    afterSetExtremesBand(params) {
      if (this.symbolSelected[0] && params.type === "setExtremes") {
        const delta = (Math.round(params.max) - Math.round(params.min)) / 1000;

        if (delta <= 3600) {
          Vue.$log.debug(`Секундные`);
          params.interval = 's';
        }
        if (delta > 3600 && delta <= 60000) {
          Vue.$log.debug(`Минутные`);
          params.interval = 'm';
        }
        if (delta > 60000 && delta <= 3600000) {
          Vue.$log.debug(`Часовые`);
          params.interval = 'h';
        }
        if (delta > 3600000 && delta <= 86400000) {
          Vue.$log.debug(`Дневные`);
          params.interval = 'd';
        }
        if (delta > 86400000 && delta <= 604800000) {
          Vue.$log.debug(`Неделя`);
          params.interval = 'w';
        }
        if (delta > 604800000 && delta <= 2592000000.000001) {
          Vue.$log.debug(`Месяц`);
          params.interval = 'm';
        }
        if (delta > 2592000000.000001 && delta <= 31536000000.428898) {
          Vue.$log.debug(`Год`);
          params.interval = 'y';
        }
        const ohlcParams = {
          ticker: this.symbolSelected[0].ticker,
          interval: params.interval,
          begin: Math.round(params.min),
          end: Math.round(params.max),
        };
        this.getOhlc(ohlcParams);
        console.log(`params: `, params);
      }
    },
  },
  mounted() {
    this.stockOptions.series[0].data = this.seriesOhlc;
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