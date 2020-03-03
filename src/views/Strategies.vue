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
                <v-btn @click="ChangeStatus" icon small>
                  <v-icon>play_circle_outline</v-icon>
                </v-btn>
                <v-btn @click="ChangeStatus" icon small>
                  <v-icon>pause_circle_outline</v-icon>
                </v-btn>
                <v-btn icon small disabled></v-btn>

                <v-menu bottom left v-model="createMenu" :close-on-content-click="false" min-width=200 max-width=200>
                  <template v-slot:activator="{on}">
                    <v-btn v-on="on" icon small>
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item @click="CreatePortfolio">
                      <v-list-item-title>Portfolio</v-list-item-title>
                    </v-list-item>

                    <v-list-group>
                      <template v-slot:activator>
                        <v-list-item-title>Strategy</v-list-item-title>
                      </template>                        
                      <v-list-group v-for="(cat, i) in categories" :key="i" no-action sub-group>
                        <template v-slot:activator>
                          <v-list-item-title>{{cat.name}}</v-list-item-title>
                        </template>
                        <v-list-item v-for="(script, i) in cat.scripts" :key="i" @click="CreateStrategy(script.id)">
                          <v-list-item-title>{{script.name}}</v-list-item-title>
                        </v-list-item>
                      </v-list-group>
                    </v-list-group>
                  </v-list>
                </v-menu>

                <v-btn @click="DeleteStrategy" icon small>
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-toolbar>
              <v-divider></v-divider>

              <!-- Strategies tree -->
              <v-sheet class="overflow-y-auto" height="424">
                <v-treeview :items="portfolios" item-children="strategies" @update:active="SelectStrategy" transition activatable dense>
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
            <v-card height="370">
              <v-toolbar dense flat>
                <v-toolbar-title>Params</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
<!--
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
-->              
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col xs="12" sm="12" md="12" lg="8" xl="8" class="pt-0">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="12" xl="12">
            <!-- Graphics -->
            <v-card height="470">
              <v-toolbar dense flat>
                <v-toolbar-title>График</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-divider></v-divider>
              <!--
              <v-container>
                <highcharts
                  ref="OhlcChart"
                  class="stock"
                  :constructor-type="'stockChart'"
                  :options="chartOptions"
                ></highcharts>
              </v-container>
              -->
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
import { IOrder, ITrade } from '../store/types';

stockInit(Highcharts);
Vue.use(HighchartsVue);

export default Vue.extend({
  data() {
    return {
      createMenu: false,
      max40chars: (v) => v.length <= 40 || 'Input too long!',
      paramsHeader: [
        { text: 'Param', align: 'left', sortable: false, value: 'key' },
        { text: 'Value', align: 'left', sortable: false, value: 'value' },
      ],
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
    categories()  { return this.$store.state.scripts.categories; },
    portfolios()  { return this.$store.state.strategies.portfolios; },
    isPortfolio() { return this.$store.state.strategies.portfolio.id; },
    portfolio()   { return this.$store.state.strategies.portfolio; },
    strategy()    { return this.$store.state.strategies.strategy; },

    StrategyParams: {
      get() {
        return this.$store.state.strategies.strategy.params;
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
      this.createMenu = false;
      this.$store.dispatch('strategies/CreatePortfolio');
    },
    CreateStrategy(scriptId) {
      this.createMenu = false;
      this.$store.dispatch('strategies/CreateStrategy', scriptId);
    },

    // Current strategy or portfolio
    async SelectStrategy(selected: string[]) {
      if (selected.length > 0) {
        const id = selected[0];
        const portfolio = this.portfolios.find((cat) => cat.id === id);
        if (portfolio) {
          this.$store.commit('strategies/SetPortfolio', {...portfolio});
        } else {
          await this.$store.dispatch('strategies/GetStrategy', id);
          // await this.$store.dispatch('scripts/GetTestReport', id);
          // await this.$store.dispatch('scripts/GetTestLogs', id);
        }
      }
    },

    DeleteStrategy() {
      if (this.isPortfolio) {
        this.$store.dispatch('strategies/DeletePortfolio');
      } else {
        this.$store.dispatch('strategies/DeleteStrategy');
      }
    },

    // Strategy state color
    GetStateColor(state: string) {
        let сolor = 'grey';
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

  // Hooks
  async created() {
    await this.$store.dispatch('strategies/GetPortfolios');
    await this.$store.dispatch('strategies/SubscribeStrategies');
  },

  beforeDestroy() {
    this.$store.dispatch('strategies/UnsubscribeStrategies');
  },
});
</script>