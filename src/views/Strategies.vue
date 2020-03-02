<template>
  <v-container fluid class="pt-0 pb-0">
    <v-row>
      <v-col xs="12" sm="12" md="12" lg="4" xl="4" class="pt-0 mb-0">
        <v-row class="pt-0 mb-0">
          <v-col xs="12" sm="12" md="12" lg="12" xl="12">
            
            <!-- Strategies tree -->
            <v-card height="100%">
              <v-toolbar dense flat>
                <v-toolbar-title>Strategies</v-toolbar-title>
                <v-spacer></v-spacer>
                <div v-if="Portfolio.id && !Strategy.id">
                  <v-menu bottom :close-on-content-click="false">
                    <template v-slot:activator="{on}">
                      <v-btn v-on="on" icon small>
                        <v-icon>post_add</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense expand>
                      <v-list-group no-action
                        v-for="(cat, i) in ScriptsCategories"
                        :key="i"
                      >
                        <template v-slot:activator>
                          <v-list-item-title>{{cat.name}}</v-list-item-title>
                        </template>

                        <v-list-item
                          v-for="(script, i) in cat.scripts"
                          :key="i"
                          @click="CreateStrategy(script.id)"
                        >
                          <v-list-item-title>{{script.name}}</v-list-item-title>
                        </v-list-item>
                      </v-list-group>

                    </v-list>
                  </v-menu>
                </div>

                <div v-if="Strategy.id">
                  <v-btn
                    v-if="Strategy.state === 'stop'"
                    icon
                    small
                    v-on:click="ChangeStatus"
                  >
                    <v-icon>play_circle_outline</v-icon>
                  </v-btn>

                  <v-btn
                    v-else-if="Strategy.state === 'run'"
                    icon
                    small
                    v-on:click="ChangeStatus"
                  >
                    <v-icon>pause_circle_outline</v-icon>
                  </v-btn>

                  <v-btn
                    v-else-if="Strategy.state === 'error'"
                    icon
                    small
                    v-on:click="ChangeStatus"
                  >
                    <v-icon>replay</v-icon>
                  </v-btn>
                </div>

                <v-btn @click="CreatePortfolio" icon small>
                  <v-icon>mdi-folder</v-icon>
                </v-btn>

                <v-btn @click="DeletePortfolioOrStrategy" icon small>
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-toolbar>
              <v-divider></v-divider>

              <!-- Strategies tree -->
              <v-sheet class="overflow-y-auto" height="424">
                <v-treeview :items="Portfolios" item-children="strategies" @update:active="Select" transition activatable dense>
                  <template v-slot:prepend="{item, open}">
                    <v-icon v-if="item.strategies">{{open ? 'mdi-folder-open' : 'mdi-folder'}}</v-icon>
                    <v-icon v-else>mdi-file-document-outline</v-icon>
                  </template>

                  <template v-slot:append="{item: {strategies, state}}">
                    <v-chip v-if="!strategies" :color="GetStateColor(state)" dark label x-small>{{state}}</v-chip>
                  </template>
                </v-treeview>
              </v-sheet>
            </v-card>
          </v-col>

          <!-- Params -->
          <v-col xs="12" sm="12" md="12" lg="12" xl="12" class="pt-0">
            <v-card height="100%">
              <v-toolbar dense flat>
                <v-toolbar-title>Params</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-data-table :headers="paramsHeader" :items="StrategyParams" height="261">
                <template v-slot:item.value="props">
                  <v-edit-dialog :return-value.sync="props.item.value" large persistent>
                    <div>{{ props.item.value }}</div>
                    <template v-slot:input>
                      <div class="mt-4 title">Update value</div>
                    </template>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.value"
                        :rules="[max40chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col xs="12" sm="12" md="12" lg="8" xl="8" class="pt-0">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="12" xl="12">
            <!-- Graphics -->
            <v-card height="100%">
              <v-toolbar dense flat>
                <v-toolbar-title>График</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-divider></v-divider>
              <v-container>
                <highcharts
                  ref="OhlcChart"
                  class="stock"
                  :constructor-type="'stockChart'"
                  :options="chartOptions"
                ></highcharts>
              </v-container>
            </v-card>
          </v-col>

          <!-- Table -->
          <v-col xs="12" sm="12" md="12" lg="12" xl="12" class="pt-0">
            <v-card height="100%">
              <v-container fluid>
                <v-tabs height="45">
                  <v-tab>Orders</v-tab>
                  <v-tab>Trades</v-tab>

                  <!-- Orders -->
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table
                      :headers="ordersHeaders"
                      :items="orders"
                      item-key="id"
                      height="300"
                      dense
                      disable-sort
                      fixed-header
                      disable-pagination
                      hide-default-footer
                    >
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
                    <v-data-table
                      :headers="tradesHeaders"
                      :items="trades"
                      item-key="id"
                      height="300"
                      dense
                      disable-sort
                      fixed-header
                      disable-pagination
                      hide-default-footer
                    >
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
import Vue from 'vue';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import { IOrder, ITrade } from '@/store/types';

stockInit(Highcharts);
Vue.use(HighchartsVue);

export default Vue.extend({
  data() {
    return {
      snack: false,
      // active: [],
      snackColor: '',
      snackText: '',
      max40chars: (v) => v.length <= 40 || 'Input too long!',
      paramsHeader: [
        {
          text: 'Param',
          align: 'left',
          sortable: false,
          value: 'key',
        },
        {
          text: 'Value',
          align: 'left',
          sortable: false,
          value: 'value',
        },
      ],
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
        series: [
          {
            dataGrouping: {
              enabled: false,
            },
          },
        ],
        credits: {
          enabled: false,
        },
      },
      // Orders table
      ordersHeaders: [
        { text: 'Time', value: 'time' },
        { text: 'State', value: 'state' },
        { text: 'Type', value: 'type' },
        { text: 'Ticker', value: 'ticker' },
        { text: 'Side', value: 'side' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Action', value: 'action' },
      ],

      // Trades table
      tradesHeaders: [
        { text: 'Time', value: 'time' },
        { text: 'Ticker', value: 'ticker' },
        { text: 'Side', value: 'side' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
      ],
    };
  },
  computed: {
    Portfolios: {
      get() {
        return this.$store.state.strategies.portfolios;
      },
    },
    Portfolio: {
      get() {
        return this.$store.state.strategies.portfolio;
      },
    },
    Strategy: {
      get() {
        return this.$store.state.strategies.strategy;
      },
    },
    StrategyParams: {
      get() {
        return this.$store.state.strategies.strategy.params;
      },
    },
    ScriptsCategories: {
      get() {
        return this.$store.state.scripts.categories;
      },
    },
    // Trades table
    trades() {
      return this.$store.state.strategies.trades.map((trade: ITrade) => {
        return {
          id: trade.id,
          ticker: trade.ticker,
          side: trade.side,
          price: trade.price.toLocaleString(),
          quantity: trade.volume,
          time: new Date(trade.time).toLocaleString(),
        };
      });
    },

    // Orders table
    orders() {
      return this.$store.state.strategies.orders.map((order: IOrder) => {
        return {
          id: order.id,
          state: order.state,
          ticker: order.ticker,
          type: 'limit', // TODO
          side: order.side,
          price: order.price.toLocaleString(),
          quantity: order.volume,
          time: new Date(order.time).toLocaleString(),
        };
      });
    },
  },

  methods: {
    CreatePortfolio() {
      this.$store.dispatch('strategies/CreatePortfolio');
    },
    CreateStrategy(scriptId) {
      this.$store.dispatch('strategies/CreateStrategy', scriptId);
    },
    Select(selected: string[]) {
      if (selected.length > 0) {
        const id = selected[0];
        //  we get a portfolio
        if (
          this.$store.state.strategies.portfolios.find(
            (portfolio) => portfolio.id === id)) {
          // const portfolio = this.Portfolios.find(
          //   (portfolio) => portfolio.id === id
          // );

          const portfolio = this.$store.state.strategies.portfolios.find(
            (portfolio) => portfolio.id === id);

          this.$store.commit('strategies/SetCurrentPortfolio', portfolio);
          this.$store.dispatch('scripts/GetScripts');
          if (!this.$store.state.strategies.portfolio.strategy) {
            this.$store.commit('strategies/SetCurrentStrategy', {
              id: '',
              name: '',
              portfolioId: '',
              scriptId: '',
              params: [],
            });
          }
        } else {
          const cportfolio = this.$store.state.strategies.portfolios.find(
            (portfolio) => portfolio.strategies.find((strategy) => strategy.id === id));
          this.$store.commit('strategies/SetCurrentPortfolio', cportfolio);
          const strategy = this.$store.state.strategies.portfolio.strategies.find((strategy) => strategy.id === id);
          this.$store.commit('strategies/SetCurrentStrategy', strategy);
        }
      }
    },
    DeletePortfolioOrStrategy() {
      this.$store.dispatch('strategies/DeleteStrategy');
    },

    // Strategy state color
    GetStateColor(state: string) {
        let сolor = 'amber';
        switch (state) {
          case 'run':   сolor = 'green'; break;
          case 'error': сolor = 'red'; break;
          case 'stop':  сolor = 'grey'; break;
        }
        return сolor;
    },

    // Side color
    GetSideColor(side: string) {
      return side === 'buy' ? 'green' : 'red';
    },
    SaveStrategy() {
      this.$store.commit('strategies/SaveStrategy');
    },
    ChangeStatus() {
      // console.log("ChangeState");
      this.$store.dispatch('strategies/ChangeStatus');
    },
  },
});
</script>