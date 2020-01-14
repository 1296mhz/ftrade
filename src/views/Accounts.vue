<template>
  <v-container fluid class="pt-0 pb-0">
    <v-row>
      <v-col xs="12" sm="12" md="10" lg="12" xl="12">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="10" xl="10">
            <v-card height="100%">
              <v-container fluid>
                <v-data-table
                  :headers="account_header"
                  :items="vaccounts"
                  :items-per-page="5"
                  item-key="Id"
                  class="elevation-0"
                  height="300"
                  fixed-header
                  disable-pagination
                  hide-default-footer
                  dense
                  loading-text="Loading... Please wait"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-icon small @click="deleteVirtualAccount(item.Id)">cancel</v-icon>
                  </template>
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="2" lg="2" xl="2">
            <v-card height="100%">
              <v-card-text>
                <v-form ref="form">
                  <v-row align="center" justify="space-between">
                    <v-text-field
                      v-model="newAccount.Name"
                      :counter="20"
                      label="Name"
                      required
                      class="mx-2"
                    ></v-text-field>
                    <v-select
                      v-model="newAccount.ExecutorId"
                      :items="ExecutorsIds"
                      label="Executor"
                      required
                      class="mx-2"
                      :disabled="!validName"
                    ></v-select>
                    <v-select
                      v-model="newAccount.RealAccount"
                      :items="accounts"
                      label="Real Account"
                      required
                      class="mx-2"
                      :disabled="!validExecutor"
                    ></v-select>
                    <v-text-field
                      v-model="newAccount.Balance"
                      label="Balance"
                      required
                      class="mx-2"
                      :disabled="!validRealAccount"
                    ></v-text-field>
                  </v-row>
                  <v-row align="center" justify="space-between">
                    <v-btn
                      class="ma-2"
                      small
                      color="success"
                      :disabled="!validBalance"
                      @click="createVirtualAccount()"
                    >Create</v-btn>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card height="100%">
              <v-container >
                <v-card-title>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="beginDateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="beginDate"
                            label="Begin date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="beginDate" @input="beginDateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="endDateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="endDate"
                            label="End date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="endDate" @input="endDateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="reports_header"
                    :items="reports"
                    :items-per-page="5"
                    item-key="title"
                    class="elevation-0"
                    height="300"
                    fixed-header
                    disable-pagination
                    hide-default-header
                    hide-default-footer
                    dense
                    loading-text="Loading... Please wait"
                  ></v-data-table>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col xs="12" sm="12" md="5" lg="5" xl="5">
            <v-card>
              <v-card-title>
                <v-icon large left>show_chart</v-icon>
                <span class="title font-weight-light">Report</span>
              </v-card-title>
              <v-card-text>
                  <highcharts
                    class="stock"
                    :constructor-type="'stockChart'"
                    :options="chartOptions"
                  ></highcharts>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card height="100%">
              <v-card-title>
                <v-icon large left>show_chart</v-icon>
                <span class="title font-weight-light">Trades</span>
              </v-card-title>
              <v-card-text>
                <v-container fluid>
                  <v-data-table
                    :headers="trades_headers"
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
                </v-container>
              </v-card-text>
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
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';

stockInit(Highcharts);
Vue.use(HighchartsVue);
export default (Vue as VueConstructor<any>).extend({
  data() {
    return {
      beginDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      beginDateMenu: false,
      endDateMenu: false,
      reports: [
        { title: 'Profile', value: '10' },
        { title: 'Tax', value: '1' },
      ],
      ExecutorsIds: ['Dummy', 'Exante', 'BCS'],
      validateAccount: false,
      vaccounts: [],
      newAccount: {
        Name: '',
        ExecutorId: '',
        RealAccount: '',
        Balance: 0,
      },
      reports_header: [
        {
          text: 'title',
          value: 'title',
        },
        {
          text: 'value',
          value: 'value',
        },
      ],
      trades_headers: [
        { text: 'Time', value: 'time' },
        { text: 'Ticker', value: 'ticker' },
        { text: 'Side', value: 'side' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
      ],
      account_header: [
        {
          text: 'Id',
          value: 'Id',
        },
        {
          text: 'Name',
          value: 'Name',
        },
        {
          text: 'Executor',
          value: 'ExecutorId',
        },
        {
          text: 'Real Account',
          value: 'RealAccount',
        },
        {
          text: 'Balance',
          value: 'Balance',
        },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      // OHLC chart options
      chartOptions: {
        chart: {
          type: 'area',
          animation: false,
        },
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        title: {
          text: 'Account not selected',
        },
        rangeSelector: {
          enabled: false,
        },
        xAxis: {
          allowDecimals: false,
          labels: {
            formatter: function() {
              return this.value; // clean, unformatted number for year
            },
          },
          accessibility: {
            rangeDescription: 'Range: 1940 to 2017.',
          },
        },
        yAxis: {
          title: {
            text: 'Orders Volume',
          },
          labels: {
            formatter: function() {
              return this.value / 1000 + 'k';
            },
          },
        },
        tooltip: {
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },
        plotOptions: {
          area: {
            pointStart: 1940,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true,
                },
              },
            },
          },
        },
        series: [
          {
            name: 'USA',
            data: [
              null,
              null,
              null,
              null,
              null,
              6,
              11,
              32,
              110,
              235,
              369,
              640,
              1005,
              1436,
              2063,
              3057,
              4618,
              6444,
              9822,
              15468,
              20434,
              24126,
              27387,
              29459,
              31056,
              31982,
              32040,
              31233,
              29224,
              27342,
              26662,
              26956,
              27912,
              28999,
              28965,
              27826,
              25579,
              25722,
              24826,
              24605,
              24304,
              23464,
              23708,
              24099,
              24357,
              24237,
              24401,
              24344,
              23586,
              22380,
              21004,
              17287,
              14747,
              13076,
              12555,
              12144,
              11009,
              10950,
              10871,
              10824,
              10577,
              10527,
              10475,
              10421,
              10358,
              10295,
              10104,
              9914,
              9620,
              9326,
              5113,
              5113,
              4954,
              4804,
              4761,
              4717,
              4368,
              4018,
            ],
          },
        ],
      },
    };
  },
  watch: {
    // When you change the object of the $ router, each time we call to get the symbols (call function getSymbols)
    $route: {
      handler: function() {},
      immediate: true,
    },
    getCurrentAccount(newVal: any) {
      Vue.$log.debug(`${newVal.Id}`);
    },
  },
  computed: {
    ...mapGetters(['accounts']),
    validName: function() {
      return (
        (this.newAccount.Name && this.newAccount.Name.length <= 15) || false
      );
    },
    validExecutor: function() {
      return this.newAccount.ExecutorId && this.validName;
    },
    validRealAccount: function() {
      return (
        this.validExecutor && this.validName && this.newAccount.RealAccount
      );
    },
    validBalance: function() {
      return (
        this.validExecutor &&
        this.validName &&
        this.validRealAccount &&
        this.newAccount.Balance &&
        this.newAccount.Balance >= 1
      );
    },
  },
  methods: {
    deleteVirtualAccount: (accountId) => {
      Vue.$log.debug(`Delete account: ${accountId}`);
    },
    createVirtualAccount: () => {},
  },
  mounted() {
    this.setAccounts();
  },
});
</script>

