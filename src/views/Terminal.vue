<template>
  <v-container fluid>
    <v-row>
      <v-col cols="10" md="10" xs="10" sm="10" lg="10" xl="10">
        <v-row>
          <!-- ticker table -->
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
            <v-card height="100%">
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
                      <td>
                        <v-icon small :color="symbol.color">mdi-circle</v-icon>
                        {{ symbol.ticker }}
                      </td>
                      <td>{{ symbol.bid }}</td>
                      <td>{{ symbol.ask }}</td>
                      <td>
                        <v-icon small @click="deleteItem(symbol)">mdi-close-box-outline</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>

          <!-- chart -->
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
            <v-card height="100%">
              <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
            </v-card>
          </v-col>
        </v-row>

        <!-- positions, ordersm trades -->
        <v-row>
          <v-col cols="12" md="12" xs="12" sm="12" lg="12" xl="12">
            <v-card height="100%">
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
                  <v-data-table dense :headers="position_headers" :items="positions" item-key="id"></v-data-table>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="pt-6" md="12" xs="12" sm="12" lg="2" xl="2" >
        <v-card height="100%">
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
                <v-col>
                  <v-btn small @click="genSeries" block color="success">Buy</v-btn>
                </v-col>
                <v-col>
                  <v-btn small @click="handlerSell" block color="error">Sell</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>


<script lang="ts">
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      amount: "",
      price: "",
      handlerBuy: () => {},
      handlerSell: () => {},
      series: [],
      order_headers: [
        { text: "State", value: "state" },
        { text: "Ticker", value: "ticker" },
        { text: "Type", value: "type" },
        { text: "Side", value: "side" },
        { text: "Quantity", value: "quantity" },
        { text: "Time", value: "time" }
      ],
      position_headers: [
        { text: "Ticker", value: "ticker" },
        { text: "Position", value: "position" },
        { text: "Avg.Price", value: "avgprice" },
        { text: "Price", value: "price" },
        { text: "P&L", value: "pnl" }
      ],

      stockOptions: {
        rangeSelector: {
          selected: 1
        },
        title: {
          text: "AAPL Stock Price"
        },
        series: this.series
      }
    };
  },
  watch: {
    seriesOhlc: function(newVal) {
      this.stockOptions.series = newVal;
    }
  },
  computed: {
    ...mapGetters({
      symbols: "terminal/SYMBOLS",
      tickers: "terminal/TICKERS",
      positions: "terminal/POSITIONS",
      orders: "terminal/ORDERS",
      seriesOhlc: "terminal/SERIES"
    })
  },
  methods: {
    ...mapActions({
      genSeries: "terminal/series"
    })
  },
  created() {},
  mounted() {
    this.stockOptions.series = this.seriesOhlc;
  }
};
</script>

<style scoped lang="css">
</style>