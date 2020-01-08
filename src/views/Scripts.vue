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
                <v-list-item @click="">
                  <v-list-item-title>Script</v-list-item-title>
                </v-list-item>
                <v-list-item @click="">
                  <v-list-item-title>Category</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn icon small>
              <v-icon>delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>

          <v-sheet class="overflow-y-auto" height="300">
            <v-treeview :items="categories" item-children="scripts" item-key="name" transition activatable dense>
              <template v-slot:prepend="{item, open}">
                <v-icon v-if="item.scripts">{{open ? 'mdi-folder-open' : 'mdi-folder'}}</v-icon>
                <v-icon v-else>mdi-file-document-outline</v-icon>
              </template>
            </v-treeview>
          </v-sheet>
        </v-card>
      </v-col>

      <!-- Script parameters -->
      <v-col>
        <v-card>
          <v-container>
            <v-form>
              <v-row dense>
                <v-col cols="6">
                  <v-text-field label="Name" dense></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select :items="categories" item-text="name" item-value="id" label="Category" dense></v-select>
                </v-col>
              </v-row>
              <v-row dense>
                <v-textarea rows="35" no-resize dense solo flat></v-textarea>
              </v-row>
              <v-row justify="end" dense>
                <v-btn color="success" @click="" small>Save</v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>

      <!-- Test result -->
      <v-col>
        <v-card>
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

stockInit(Highcharts);
Vue.use(HighchartsVue);

export default Vue.extend({
  data() {
    return {
      /*categories: [
        { id: 'cid1', name: 'Category 1', scripts: [] },
        { id: 'cid2', name: 'Category 2', scripts: [{ id: 'sid1', name: 'Script 1' }, { id: 'sid2', name: 'Script 2'}]},
        { id: 'cid3', name: 'Category 3', scripts: [{ id: 'sid3', name: 'Script 3' }, { id: 'sid4', name: 'Script 4'}]},
      ],*/

    };
  },

  computed: {
    // Symbols table
    categories() {
      return this.$store.state.scripts.categories;
    },
  },

  // Hooks
  async created() {
    await this.$store.dispatch('GetScripts');
    // await this.$store.dispatch('SubscribeSymbols');
  },

  beforeDestroy() {
    // this.$store.dispatch('UnsubscribeSymbols');
  },
});
</script>