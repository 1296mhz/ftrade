<template>
 <div>
    <v-overlay :value="!centrifugeConnectedFlag" :z-index="zIndex" :opacity="opacity">
      <v-progress-circular indeterminate size="64" color="purple"></v-progress-circular>
    </v-overlay>
  <v-app id="inspire">

    <v-navigation-drawer 
    v-model="drawer" 
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
      <accounts-list :setCurrentAccount="setCurrentAccount" :account="currentAccount" :accounts="accounts"></accounts-list>
      <v-btn icon @click="exit()">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <div height="80vh">
      <router-view></router-view>
      </div>
    </v-content>
  </v-app>
</div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { eventBus } from '../main';
import AccountList from '../components/AccountsList.vue';

export default (Vue as VueConstructor<any>).extend({
  name: 'App',
  props: {
    source: String,
  },
    components: {
    'accounts-list': AccountList,
  },
  data() {
    return {
      opacity: 0.46,
      zIndex: 10,
      overlay: false,
      drawer: true,
      mini: true,
    };
  },
  watch: {
    getCentrifugeConnectedFlag(newVal: boolean) {
      Vue.$log.debug(`Watch fire - ${newVal}`);
      if (newVal) {
         eventBus.$emit('info', `Welcome to Gimaym!`);
         this.setAccounts();
      }

      if (!newVal) { Vue.$log.debug(`Connection lost`); }
    },
    accounts(newVal: any) {
      if (this.accounts.length >= 1) {
        this.setCurrentAccount(this.accounts[0]);
      }
    },
  },
  computed: {
    ...mapGetters({
      currentView: 'app/CURRENT_VIEW',
      getCentrifugeConnectedFlag: 'app/CENTRIFUGE_CONNECTED_FLAG',
      getAccounts: 'app/ACCOUNTS',
      getCurrentAccount: 'app/CURRENT_ACCOUNT_COMBOBOX',
    }),
    currentViewText: function() {
      return this.currentView[0].toUpperCase() + this.currentView.slice(1);
    },
    centrifugeConnectedFlag: {
      get: function() {
        return this.getCentrifugeConnectedFlag;
      },
      set: function(value) {
        this.setCentrifugeConnectedFlag(value);
      },
    },
    accounts: {
      get: function() {
      return this.getAccounts;
      },
      set: () => {
        // this.setAccounts;
      },
    },
    currentAccount: {
      get: function() {
        return this.getCurrentAccount;
      },
      set: function(account) {
        this.setCurrentAccount(account);
      },
    },
  },
  methods: {
    ...mapActions({
      logout: 'auth/exit',
      setAccounts: 'app/accounts',
      setCurrentAccount: 'app/currentAccountCombobox',
      setCentrifugeConnectedFlag: 'app/centrifugeConnectedFlag',
    }),
    async exit() {
      await this.logout();
      this.$router.push('/login');
    },
  },
});
</script>
