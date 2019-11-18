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
                  <v-text-field
                    v-model="username"
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      :loading="loading"
                      :disabled="loading"
                      type="submit"
                    >Login</v-btn>
                  </v-card-actions>
                  <v-alert
                    :value="status.state"
                    type="error"
                    transition="scale-transition"
                  >{{status.message}}</v-alert>
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
import Vue, { VueConstructor } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { IAuthStatus } from '../store/auth/types';

export default (Vue as VueConstructor<any>).extend({
  name: 'Login',
  props: {
    source: String,
  },
  data: () => ({
    username: null,
    password: null,
    drawer: null,
  }),
  watch: {},
  methods: {
    ...mapActions({
      login: 'auth/login',
      loginToken: 'auth/loginToken',
    }),
    async submit() {
      const payload = {
        password: this.password,
        username: this.username,
      };
      const response = await this.login(payload);
      this.$router.push('/dashboard');
    },
  },
  computed: {
    ...mapGetters({
      status: 'auth/status',
      token: 'auth/token',
      usernameToken: 'auth/usernameToken',
    }),
    loading: {
      get() {
        let status = false;
        if (this.status.message === 'Loading') {
          status = true;
        }
        return status;
      },
    },
    error: {
      get() {
        return this.status.state;
      },
    },
  },
  mounted() {
  },
});
</script>
