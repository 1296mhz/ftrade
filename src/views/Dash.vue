<template>
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

      <v-btn icon @click="logout()">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <div height="80vh">
      <router-view></router-view>
      </div>
    </v-content>

  </v-app>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { eventBus } from '../main';
export default {
  name: 'App',
  props: {
    source: String,
  },
  data() {
    return {
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
    }),
  },
  created() {
     eventBus.$emit('info', `Welcome to Gimaym!`);
  },
};
</script>
