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
                    <v-btn color="primary" :loading="loading" :disabled="loading" type="submit">Login</v-btn>
                  </v-card-actions>
                  <v-alert :value="error" type="error" transition="scale-transition">{{error}}</v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";
import { AuthStatus } from '../store/auth/types';

export default {
  props: {
    source: String
  },
  data: () => ({
    username: null,
    password: null,
    drawer: null
  }),
  watch: {
    username: function() {
      console.log("Fire");
    }
  },
  methods: {
    ...mapActions({
      login: "auth/login"
    }),
    async submit() {
      let payload = {
        password: this.password,
        username: this.username
      };
      try {
        const response = await this.login(payload);
        this.$router.push("/");
      } catch (err) {
        console.log("Error", err);
      }
    }
  },
  computed: {
    ...mapGetters({
      status: "auth/status",
    }),
    loading: {
      get: function() {
        return this.status === AuthStatus.Success;
      }
    },
    error: {
      get: function() {
        return this.status === AuthStatus.Failed ? 'Incorrect login or password' : false;
      }
    },
  }
};
</script>
