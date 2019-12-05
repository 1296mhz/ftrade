<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="submit">
                  <v-text-field v-model="username" label="Login" prepend-icon="person" type="text"></v-text-field>
                  <v-text-field v-model="password" label="Password" prepend-icon="lock" type="password"></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :loading="loading" :disabled="loading" type="submit">Login</v-btn>
                  </v-card-actions>
                  <v-alert :value="error != ''" type="error" transition="scale-transition">{{error}}</v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    username: null,
    password: null,
    loading: false,
  }),

  computed: {
    error() { return this.$store.state.error; },
  },

  methods: {
    // Login
    async submit() {
      try {
        await this.$store.dispatch('Login', {
          password: this.password,
          username: this.username,
        });
        await this.$store.dispatch('Connect');
        await this.$store.dispatch('GetAccounts');

        this.$router.push('/terminal');
      } catch {/**/}
    },
  },
});
</script>
