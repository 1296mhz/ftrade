<template>
  <v-app id="inspire">
  <!-- <v-overlay :value="overlay"> -->

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
      <accounts-list></accounts-list>
      <v-btn icon @click="logout()">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <div height="80vh">
      <router-view></router-view>
      </div>
   <!-- <v-progress-circular
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular> -->
   
    </v-content>
 <!-- </v-overlay> -->
  </v-app>
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
      overlay: false,
      drawer: true,
      mini: true,
    };
  },
  computed: {
    ...mapGetters({
      currentView: 'app/CURRENT_VIEW',
    }),
    currentViewText: function() {
      return this.currentView[0].toUpperCase() + this.currentView.slice(1);
    },
  },
  methods: {
    ...mapActions({
      logout: 'auth/exit',
      setAccounts: 'app/accounts',
    }),
  },
  created() {
     eventBus.$emit('info', `Welcome to Gimaym!`);
  },
  mounted() {
      Vue.$log.debug('Dash component start!');
  },
});
</script>
