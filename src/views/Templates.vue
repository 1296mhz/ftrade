<template>
  <div>
      <v-navigation-drawer v-model="drawer" permanent absolute>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>extension</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>Templates</v-list-item-title>
          <v-btn icon>
            <v-icon>add</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>
        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

   

      <v-container fluid fill-height>
        <v-card>
          <v-text-field v-model="currentTemplate.script"></v-text-field>
        </v-card>
      </v-container>

 </div>
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
      drawer: true,
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' },
      ],
      mini: true,
      templates: [],
      currentTemplate: {
        script: '',
      },
    };
  },
});
</script>