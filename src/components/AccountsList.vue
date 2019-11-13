
<template>
  <v-col cols="5" xs="6" sm="6" md="3" lg="2" xl="2">
    <v-combobox
      v-model="aDefault"
      :items="accounts"
      :label="accountMessage"
      hide-details
      prepend-icon="account_balance_wallet"
      auto-select-first
      dense
      hide-no-data
      :disabled="disableCombo"
      return-object
    ></v-combobox>
  </v-col>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<any>).extend({
  props: ['setCurrentAccount', 'account', 'accounts'],
  data: () => ({
    disabled: false,
    label: 'Select a account',
  }),
  computed: {
    accountMessage: function() {
      return this.accounts.length < 1 ? 'Account not found' : 'Choose account';
    },
    disableCombo: function() {
      if (this.accounts.length < 1) {
        return true;
      }
    },
    aDefault: {
      get: function() {
        return this.account;
      },
      set: function(account) {
        this.setCurrentAccount(account);
      },
    },
  },
});
</script>