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
                >
                  <template v-slot:body="{ items }">
                    <tbody>
                      <tr
                        v-for="item in items"
                        :key="item.ticker"
                        @click="selectSymbol(item)"
                        :class="{'selectedRow': item.ticker === symbolSelected.ticker}"
                      >
                        <td>{{ item.ticker }}</td>
                        <td>{{ item.bid }}</td>
                        <td>{{ item.ask }}</td>
                        <td>
                          <v-icon small @click="deleteSymbol(item.ticker)">delete</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="12" lg="6" xl="6">
            <v-card height="100%">
              <v-container fluid>
                <highcharts
                  class="stock"
                  :constructor-type="'stockChart'"
                  :options="stockOptions"
                  :callback="startCharts"
                ></highcharts>
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
                        <v-chip
                          :color="getStateOrderColor(item.state)"
                          dark
                          label
                          x-small
                        >{{ item.state }}</v-chip>
                      </template>
                      <template v-slot:item.side="{ item }">
                        <v-chip :color="getSideColor(item.side)" dark label x-small>{{ item.side }}</v-chip>
                      </template>
                      <template v-slot:item.time="{ item }">{{ getTimeOrderFormat(item.time) }}</template>

                      <template v-slot:item.actions="{ item }">
                         <v-icon small @click="cancelOrder(item.id)">cancel</v-icon>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table dense :headers="trades_headers" :items="trades" item-key="id">
                      <template v-slot:item.side="{ item }">
                        <v-chip :color="getSideColor(item.side)" dark label x-small>{{ item.side }}</v-chip>
                      </template>
                      <template v-slot:item.time="{ item }">{{ getTimeOrderFormat(item.time) }}</template>
                    </v-data-table>
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
              <v-form ref="form" v-model="validOrder" lazy-validation>
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
                      <v-select
                        dense
                        :items="['Limit','Market']"
                        value="Limit"
                        :disabled="disableField"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-select dense :items="['Day','GTC']" value="Day" :disabled="disableField"></v-select>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col>
                      <v-text-field
                        dense
                        v-model="volume"
                        label="Volume"
                        :rules="volumeRules"
                        required
                        :disabled="disableField"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        dense
                        v-model="price"
                        label="Price"
                        :rules="priceRules"
                        required
                        :disabled="disableField"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col class="ma-1">
                      <v-btn
                        small
                        block
                        color="success"
                        :disabled="disableField || !validOrder"
                        @click="newOrder('buy')"
                      >Buy</v-btn>
                    </v-col>
                    <v-col class="ma-1">
                      <v-btn
                        small
                        block
                        color="error"
                        :disabled="disableField || !validOrder"
                        @click="newOrder('sell')"
                      >Sell</v-btn>
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
import Vue, { VueConstructor } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import {
  symbolHeaders,
  orderHeaders,
  positionHeaders,
  tradesHeaders,
} from './constants';
stockInit(Highcharts);

export default (Vue as VueConstructor<any>).extend({
  data() {
    return {
      chart: null,
      selectedSymbolItem: {},
      ticker: '',
      volume: 1,
      volumeRules: [
        v => !!v || 'Volume is required',
        v => (v && v >= 1) || 'Volume cannot be less than one',
      ],
      price: 1,
      priceRules: [
        v => !!v || 'Price is required',
        v => (v && v >= 1) || 'Price cannot be less than one',
      ],
      side: '',
      validOrder: false,
      series: [],
      symbol_headers: symbolHeaders,
      order_headers: orderHeaders,
      position_headers: positionHeaders,
      trades_headers: tradesHeaders,
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
    $route: {
      handler: function() {
        this.getSymbols();
        this.getOrders(this.getCurrentAccount.Id);
        this.getTrades(this.getCurrentAccount.Id);
      },
      immediate: true,
    },
    // We follow the object loadingSymbols its value will change false and
    // then we will begin to update the values of the components
    loadingSymbols(newVal: boolean) {
      if (!newVal) {
        Vue.$log.debug('Load symbols');
        this.setSymbolSelected(this.symbols[0]);
      }
    },
    // This is where the component updates when data changes.
    ohlc(newVal: any, oldVal: any) {
      this.chart = Highcharts.charts[0];
      this.stockOptions.series[0].data = [null];
      this.stockOptions.series[0].data = newVal;
      this.chart.hideLoading();
    },
    // This is where the component updates when data changes.
    getOhlcNavigator(newVal: any, oldVal: any) {
      this.chart = Highcharts.charts[0];
      this.stockOptions.navigator.series.data = [null];
      this.stockOptions.navigator.series.data = newVal;
      this.chart.xAxis[0].setExtremes();
    },
    // This is where the component updates when data changes.
    symbolSelected(newVal: any) {
      this.chart = Highcharts.charts[0];
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
      console.log('CHANGE ACCOUNT', newVal.Id);
      // this.setSymbolSelected(newVal.Id);
    },
  },
  computed: {
    ...mapGetters({
      symbols: 'terminal/SYMBOLS',
      tickers: 'terminal/TICKERS',
      positions: 'terminal/POSITIONS',
      orders: 'terminal/ORDERS',
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
    disableField: function() {
      if (this.accounts.length < 1) {
        return true;
      }
    },
  },
  methods: {
    ...mapActions({
      getSymbols: 'terminal/symbols',
      getOrders: 'terminal/orders',
      getTrades: 'terminal/trades',
      createSymbol: 'terminal/createSymbol',
      deleteSymbol: 'terminal/deleteSymbol',
      setOhlc: 'terminal/ohlc',
      setSymbolSelected: 'terminal/setSymbolSelected',
      setOhlcNavigator: 'terminal/ohlcNavigator',
      setAccounts: 'app/accounts',
      sendOrder: 'terminal/sendOrder',
    }),
    CreateSymbol(ticker: any) {
      this.createSymbol(ticker);
      this.ticker = '';
    },
    setExtremes(params: any) {
      Vue.$log.debug(params);
      this.chart = Highcharts.charts[0];
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
    getSideColor(side) {
      if (side === 'buy') return 'green';
      else if (side === 'sell') return 'red';
      else return 'lime darken-4';
    },
    getStateOrderColor(state) {
      if (state === 'filled') return 'blue lighten-1';
      else if (state === 'canceled') return 'grey darken-1';
      else if (state === 'green') return 'grey darken-1';
      else return 'lime darken-4';
    },
    getTimeOrderFormat(time) {
      const d = new Date(time);
      return (
        d.getFullYear() +
        '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + d.getDate()).slice(-2) +
        ' ' +
        d.getHours() +
        ':' +
        ('0' + d.getMinutes()).slice(-2) +
        ':' +
        d.getSeconds()
      );
    },
    newOrder(side) {
      const newOrder = {
        account: this.getCurrentAccount.Id,
        side: side,
        price: this.price,
        volume: this.volume,
        ticker: this.currentSymbol.ticker,
      };
      this.sendOrder(newOrder);
      Vue.$log.info(newOrder);
    },
    cancelOrder(orderId) {
      Vue.$log.debug(`Cancel order: ${orderId}`)
    },
  },
  created() {
    this.getSymbols();
    this.getOrders(this.getCurrentAccount.Id);
  },
  beforeDestroy() {
    if (Highcharts.charts[0] !== undefined) {
      Highcharts.charts[0].destroy();
      Highcharts.charts.splice(0, 1);
    }
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
.selectedRow {
  background-color: #b3d4fc;
  font-weight: bold;
}
.selectedRow:hover {
  background-color: #b3d4fc !important;
  font-weight: bold;
}
.selectedRow:focus {
  background-color: #b3d4fc !important;
  font-weight: bold;
}
</style>