<template>
  <v-container fluid>
    <v-row>
      <v-col xs="12" sm="12" md="10" lg="12" xl="12">
        <v-row>
          <v-col xs="12" sm="12" md="12" lg="10" xl="10">
            <v-card height="100%">
              <v-container fluid>
                <v-data-table
                  :headers="account_header"
                  :items="vaccounts"
                  :items-per-page="5"
                  item-key="Id"
                  class="elevation-0"
                  height="300"
                  fixed-header
                  disable-pagination
                  hide-default-footer
                  dense
                  loading-text="Loading... Please wait"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-icon small @click="deleteVirtualAccount(item.Id)">cancel</v-icon>
                  </template>
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="2" lg="2" xl="2">
            <v-card height="100%">
              <v-card-text>
                <v-form ref="form">
                  <v-row align="center" justify="space-between">
                    <v-text-field
                      v-model="newAccount.Name"
                      :counter="20"
                      label="Name"
                      required
                      class="mx-2"
                    ></v-text-field>
                    <v-select
                      v-model="newAccount.ExecutorId"
                      :items="ExecutorsIds"
                      label="Executor"
                      required
                      class="mx-2"
                      :disabled="!validName"
                    ></v-select>
                    <v-select
                      v-model="newAccount.RealAccount"
                      :items="accounts"
                      label="Real Account"
                      required
                      class="mx-2"
                      :disabled="!validExecutor"
                    ></v-select>
                    <v-text-field
                      v-model="newAccount.Balance"
                      label="Balance"
                      required
                      class="mx-2"
                      :disabled="!validRealAccount"
                    ></v-text-field>
                  </v-row>
                  <v-row align="center" justify="space-between">
                    <v-btn
                      class="ma-2"
                      small
                      color="success"
                      :disabled="!validBalance"
                      @click="createVirtualAccount()"
                    >Create</v-btn>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default (Vue as VueConstructor<any>).extend({
  data() {
    return {
      ExecutorsIds: ['Dummy', 'Exante', 'BCS'],
      validateAccount: false,
      vaccounts: [],
      newAccount: {
        Name: '',
        ExecutorId: '',
        RealAccount: '',
        Balance: 0,
      },
      account_header: [
        {
          text: 'Id',
          value: 'Id',
        },
        {
          text: 'Name',
          value: 'Name',
        },
        {
          text: 'Executor',
          value: 'ExecutorId',
        },
        {
          text: 'Real Account',
          value: 'RealAccount',
        },
        {
          text: 'Balance',
          value: 'Balance',
        },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
    };
  },
  watch: {
    // When you change the object of the $ router, each time we call to get the symbols (call function getSymbols)
    $route: {
      handler: function() {},
      immediate: true,
    },
    getCurrentAccount(newVal: any) {
      Vue.$log.debug(`${newVal.Id}`);
    },
  },
  computed: {
    ...mapGetters([
      'accounts',
    ]),
    validName: function() {
      return (
        (this.newAccount.Name && this.newAccount.Name.length <= 15) || false
      );
    },
    validExecutor: function() {
      return this.newAccount.ExecutorId && this.validName;
    },
    validRealAccount: function() {
      return (
        this.validExecutor && this.validName && this.newAccount.RealAccount
      );
    },
    validBalance: function() {
      return (
        this.validExecutor &&
        this.validName &&
        this.validRealAccount &&
        (this.newAccount.Balance && this.newAccount.Balance >= 1)
      );
    },
  },
  methods: {
    deleteVirtualAccount: (accountId) => {
      Vue.$log.debug(`Delete account: ${accountId}`);
    },
    createVirtualAccount: () => {},
  },
  mounted() {
    this.setAccounts();
  },
});
</script>