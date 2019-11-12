
<template>
  <v-col cols="3" col-md-4>
    <v-combobox
      v-model="aDefault"
      :items="accounts"
      :label="label"
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
  props: ['accounts'],
  data: () => ({
    account: '',
    disabled: false,
    label: 'Select a account',
  }),
  watch: {
    account: newVal => {
      console.log(newVal);
    },
  },
  computed: {
    disableCombo: function() {
      if (this.accounts.length < 1) {
        this.label = 'Account not found';
       // this.disabled = true;
        return true
      }

    },
    aDefault: {
      get: function() {

        if (!this.account) {
          return this.accounts[0];
        }

        return this.account;
      },
      set: function(account) {
        console.log(this.account);
        this.account = account;
      },
    },
  },
});
</script>