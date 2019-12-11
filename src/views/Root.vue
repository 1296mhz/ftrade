<template>
 <div>
    <v-overlay :value="false">
      <v-progress-circular indeterminate size="64" color="purple"></v-progress-circular>
    </v-overlay>
  <v-app id="inspire">

    <v-navigation-drawer 
    app 
    mini-variant
    permanent 
    disable-resize-watcher
    disable-route-watcher
    position: fixed
>
      <v-list dense>
        <v-list-item to="/dashboard">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/terminal">
          <v-list-item-action>
            <v-icon>mdi-desktop-classic</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Terminal</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>{{ currentViewText }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-col cols="5" xs="6" sm="6" md="3" lg="2" xl="2">
        <v-select :items="accounts" label="Select Account" dense single-line @change="SelectAccount"></v-select>
      </v-col>
      <v-btn icon @click="exit()">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <div height="80vh">
      <router-view></router-view>
      </div>
    </v-content>

    <!-- Snackbar -->
    <v-snackbar v-model="errorBar" color="error">
      {{ lastError }}
      <v-btn @click="errorBar = false" dark text>Close</v-btn>
    </v-snackbar>

  </v-app>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  data() {
    return {
      errorBar: false,
      currentViewText: 'Terminal',
    };
  },

  computed: {
    ...mapGetters([
      'accounts',
      'lastError',
      'errorsCount',
    ]),
  },

  watch: {
    errorsCount: function() {
      this.errorBar = true;
    },
  },

  methods: {
    SelectAccount(account: string) {
      this.$store.dispatch('SetAccount', account);
    },
    exit() {
       this.$store.dispatch('Logout');
       this.$router.push('/login');
    },
  },

});
</script>
