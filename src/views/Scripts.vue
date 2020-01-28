<template>
  <v-container>
    <v-row>
  
      <v-col cols="auto">
        <!-- Scripts tree -->
        <v-card min-width="200">
          <v-toolbar dense flat>
            <v-toolbar-title>Scripts</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon small>
                  <v-icon>add</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="CreateScript">
                  <v-list-item-title>Script</v-list-item-title>
                </v-list-item>
                <v-list-item @click="CreateCategory">
                  <v-list-item-title>Category</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn @click="DeleteCategoryOrScript" icon small>
              <v-icon>delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>

          <v-sheet class="overflow-y-auto" height="300">
            <v-treeview :items="categories" item-children="scripts" @update:active="SelectScript" transition activatable dense>
              <template v-slot:prepend="{item, open}">
                <v-icon v-if="item.scripts">{{open ? 'mdi-folder-open' : 'mdi-folder'}}</v-icon>
                <v-icon v-else>mdi-file-document-outline</v-icon>
              </template>
            </v-treeview>
          </v-sheet>
        </v-card>
      </v-col>

      <v-col>
        <!-- Script parameters -->
        <v-card v-if="scriptId">
          <v-container>
            <v-form>
              <v-row dense>
                <v-col cols="6">
                  <v-text-field v-model="scriptName" label="Name" dense></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select :items="categories" v-model="scriptCategory" item-text="name" item-value="id" label="Category" dense></v-select>
                </v-col>
              </v-row>
              <v-row dense>
                <v-textarea rows="35" v-model="scriptSource" no-resize dense solo flat></v-textarea>
              </v-row>
              <v-row justify="end" dense>
                <v-btn color="success" @click="UpdateScript" small>Save</v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>

      <!-- Test result -->
      <v-col>
        <v-card>
          <v-container>

            <!-- Instruments -->
<!--            
            <v-row dense>Instruments</v-row>
            <v-divider></v-divider>
            <v-row dense>
              <v-col cols="7">
              <v-data-table :headers="instrumentsHeaders" :items="instruments" item-key="ticker" dense height="150" fixed-header disable-pagination hide-default-footer hide-default-header>
                  <template v-slot:item.action="{ item }">
                  <v-icon small @click="">cancel</v-icon>
                </template>
              </v-data-table>
              </v-col>

              <v-col cols="5">
                <v-text-field v-model="scriptName" label="Ticker" dense></v-text-field>
                <v-text-field v-model="scriptName" label="Account" dense></v-text-field>
                <v-btn color="success" @click="" small>Add Instrument</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
-->



            <v-form>
              <v-row dense>
                <v-combobox v-model="selectedInstruments" :items="instruments" label="Instruments" multiple deletable-chips small-chips dense></v-combobox>              
              </v-row>

              <v-row dense>
                <v-col cols="4">
                  <v-menu v-model="beginMenu" :close-on-content-click="true" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="testBegin" label="Begin" readonly v-on="on" dense></v-text-field>
                    </template>
                    <v-date-picker v-model="testBegin" @input="beginMenu = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="4">
                  <v-menu v-model="endMenu" :close-on-content-click="true" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="testEnd" label="End" readonly v-on="on" dense></v-text-field>
                    </template>
                    <v-date-picker v-model="testEnd" @input="endMenu = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="4">
                  <v-select :items="intervals" v-model="testInterval" label="Interval" dense></v-select>
                </v-col>
              </v-row>



              <v-row justify="end" dense>
                <v-btn color="success" @click="UpdateScript" small>Run Test</v-btn>
              </v-row>
            </v-form>

              <v-row dense>
                <v-tabs height="45">
                  <v-tab>Logs</v-tab>
                  <v-tab>Trades</v-tab>

                  <!-- Logs -->
                  <v-tab-item transition="none" reverse-transition="none">
                  </v-tab-item>

                  <!-- Trades -->
                  <v-tab-item transition="none" reverse-transition="none">
                    <v-data-table :headers="tradesHeaders" :items="trades" item-key="id" height="300" dense disable-sort fixed-header disable-pagination hide-default-footer>
                      <template v-slot:item.side="{item: {side}}">
                        <v-chip :color="GetSideColor(side)" label x-small outlined>{{side}}</v-chip>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                </v-tabs>
              </v-row>



          </v-container>
        </v-card>
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
import uuid from 'uuid/v4';

stockInit(Highcharts);
Vue.use(HighchartsVue);

export default Vue.extend({
  data() {
    return {
      beginMenu: false,
      endMenu:   false,

      intervals: [{text: 'Minute', value: 60}, {text: 'Hour', value: 3600}, {text: 'Day', value: 86400}],

      instrumentsHeaders: [
        {text: 'Ticker', value: 'ticker'},
        {text: 'Account', value: 'account'},
        {text: 'Action', value: 'action'},
      ],

      instruments: ['RTS.FORTS.H2020', 'MXI.FORTS.H2020', 'Si.FORTS.H2020'],

      selectedInstruments: [],

      // Trades table
      tradesHeaders: [
        {text: 'Time', value: 'time'},
        {text: 'Ticker', value: 'ticker'},
        {text: 'Side', value: 'side'},
        {text: 'Price', value: 'price'},
        {text: 'Quantity', value: 'quantity'},
      ],
      trades: [],

    };
  },

  computed: {
    // Scripts tree
    categories() {
      return this.$store.state.scripts.categories;
    },

    // Script data
    scriptId() {
      return this.$store.state.scripts.script.id;
    },
    scriptName: {
      get() { return this.$store.state.scripts.script.name; },
      set(value) { this.$store.commit('SetScriptName', value); },
    },
    scriptCategory: {
      get() { return this.$store.state.scripts.script.category; },
      set(value) { this.$store.commit('SetScriptCategory', value); },
    },
    scriptSource: {
      get() { return this.$store.state.scripts.script.source; },
      set(value) { this.$store.commit('SetScriptSource', value); },
    },

    // Category data
    categoryId() {
      return this.$store.state.scripts.category.id;
    },

    // Test data
    testBegin: {
      get() { return new Date(this.$store.state.tests.test.begin).toISOString().substr(0, 10); },
      set(value: string) {
        this.$store.commit('SetTestBegin', new Date(value).getTime());
        this.$store.dispatch('UpdateTest');
      },
    },
    testEnd: {
      get() { return new Date(this.$store.state.tests.test.end).toISOString().substr(0, 10); },
      set(value: string) {
        this.$store.commit('SetTestEnd', new Date(value).getTime());
        this.$store.dispatch('UpdateTest');
      },
    },
    testInterval: {
      get() { return this.$store.state.tests.test.interval; },
      set(value) {
        this.$store.commit('SetTestInterval', value);
        this.$store.dispatch('UpdateTest');
      },
    },
  },


  methods: {
    // Select current script
    async SelectScript(selected: string[]) {
      // console.log(selected);
      if (selected.length > 0) {
        const id = selected[0];
        const cat = this.categories.find((cat) => cat.id === id);
        if (cat) {
          this.$store.commit('SetCategory', {id: cat.id, name: cat.name});
        } else {
          await this.$store.dispatch('GetScript', id);
          await this.$store.dispatch('GetTest', id);
        }
      }
    },

    // Create new script
    async CreateScript() {
      // Script
      const script = {
        id: uuid(),
        name: this.$store.getters.newScriptName,
        category: this.categoryId ? this.categoryId : this.scriptCategory,
        source: '',
      };
      await this.$store.dispatch('CreateScript', script);
      // Test
      const test = {
        id: script.id,
        name: script.name,
        parent: script.id,
        begin: Date.now() - 2592000000, // 1 Month
        end: Date.now(),
        interval: 60,
        strategies: [{
          id: uuid(),
          name: script.name,
          source: '',
        }],
      };
      await this.$store.dispatch('CreateTest', test);
    },

    UpdateScript() {
      this.$store.dispatch('UpdateScript');
    },

    // Create new category
    CreateCategory() {
      this.$store.dispatch('CreateCategory');
    },

    // Delete script or category
    DeleteCategoryOrScript() {
      if (this.categoryId) {
        this.$store.dispatch('DeleteCategory');
      } else {
        this.$store.dispatch('DeleteScript');
      }
    },


  },

  // Hooks
  async created() {
    await this.$store.dispatch('GetScripts');
    await this.$store.dispatch('SubscribeScripts');
  },

  beforeDestroy() {
    this.$store.dispatch('UnsubscribeScripts');
  },
});
</script>