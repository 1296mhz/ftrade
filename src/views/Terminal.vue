<template>
  <v-container>
    <v-row>
    <v-col cols="10">
      <v-row>
        <v-col cols="6">
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
        </v-col>

        <v-col cols="6">
          <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
        </v-col>
      </v-row>
     
      <v-row>
        <v-col cols="12">
          <v-tabs height="35">
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
                  <!--                 <div class="green text-center">
                  <span class="white--text">{{ item.state }}</span>
                </div>
                  -->
                </template>
              </v-data-table>
            </v-tab-item>

            <v-tab-item transition="none" reverse-transition="none">
              <v-data-table dense :headers="position_headers" :items="positions" item-key="id"></v-data-table>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="2">
    <v-navigation-drawer
       absolute
      permanent
      right>
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
                  <v-btn small @click="handlerBuy" block color="success">Buy</v-btn>
                </v-col>
                <v-col>
                  <v-btn small @click="handlerSell" block color="error">Sell</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
    </v-navigation-drawer>
    </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

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
    ...mapMutations({})
  },
  watch: {
    "this.$store": (newVal: any, oldVal: any) => {
      console.log("Fire");
    },
    deep: true
  },
  created() {},
  mounted() {
    this.stockOptions.series = this.seriesOhlc;
  }
};
</script>