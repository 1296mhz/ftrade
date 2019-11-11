
<template>
  <v-col cols="2">
    <v-combobox
      v-model='aDefault'
      :items='accounts'
      :label='label'
      hide-details
      prepend-icon='account_balance_wallet'
      auto-select-first
      dense
      hide-no-data
      :disabled="disabled"
    ></v-combobox>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    accounts: ['Hello', 'GoodBuy'],
    account: '',
    disabled: false,
    label: 'Select a account'
  }),
  watch: {
    account: newVal => {
      console.log(newVal);
    },
  },
  computed: {
    aDefault: {
      get: function() {
        if (this.accounts.length <= 0) {
          this.label = 'Account not found'
          this.disabled = true;
        }

        if (!this.account) {
          return this.accounts[0];
        }

        return this.account;
      },
      set: function(account) {
        this.account = account;
      },
    },
  },
});
</script>