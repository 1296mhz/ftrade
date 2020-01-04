<template>
  <v-container>
    <v-row>
  
<!--       <v-navigation-drawer v-model="drawer" permanent absolute>
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

        <v-list-group v-for="cat in categories" :key="cat.id" no-action sub-group>

          <template v-slot:prepend-icon>
              folder
          </template>


          <template v-slot:activator>
             <v-list-item-icon>
              <v-icon>folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ cat.name }}</v-list-item-title>
          </template>

          <v-list-item v-for="cat in categories" :key="cat.id" link>
            <v-list-item-content>
              <v-list-item-title>{{ cat.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>

        </v-list>
      </v-navigation-drawer>
 -->    
      <v-col>
        <!-- Scripts tree -->
        <v-card width="250">
          <v-toolbar dense flat>
            <v-toolbar-title>Scripts</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon small>
              <v-icon>mdi-file-plus-outline</v-icon>
            </v-btn>
            <v-btn icon small>
              <v-icon>mdi-folder-plus-outline</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>

          <v-sheet class="overflow-y-auto" height="300">
            <v-treeview :items="items" item-key="name" transition="true" activatable dense>

              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.file">
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                  {{ files[item.file] }}
                </v-icon>
              </template>

              <template v-slot:append="{ active }">
                  <v-icon v-if="active" small>cancel</v-icon>
              </template>
            </v-treeview>
          </v-sheet>
        </v-card>
      </v-col>

      <v-col>
          <v-card>
            <v-text-field v-model="currentTemplate.script"></v-text-field>
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
      drawer: true,

      items: [
        {
          name: '.git',
        },
        {
          name: 'node_modules',
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [{
                name: 'logosssssssssssssssssssssssssssssssss.png',
                file: 'png',
              }],
            },
            {
              name: 'favicon.ico',
              file: 'png',
            },
            {
              name: 'index.html',
              file: 'html',
            },
          ],
        },
        {
          name: '.gitignore',
          file: 'txt',
        },
        {
          name: 'babel.config.js',
          file: 'js',
        },
        {
          name: 'package.json',
          file: 'json',
        },
        {
          name: 'README.md',
          file: 'md',
        },
        {
          name: 'vue.config.js',
          file: 'js',
        },
        {
          name: 'yarn.lock',
          file: 'txt',
        },
      ],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },


      categories: [
        { id: 'cid1', name: 'Category 1'},
        { id: 'cid2', name: 'Category 2'},
        { id: 'cid3', name: 'Category 3'},
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