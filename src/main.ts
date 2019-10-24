import Vue from 'vue';
import App from './App.vue';
import '@/plugins';
import router from './router';
import vuetify from './plugins/vuetify';
// import axios from './plugins/axios';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import store from './store';

Vue.config.productionTip = false;

stockInit(Highcharts);
Vue.use(HighchartsVue);

new Vue({
  router,
  store,
  vuetify,
  created() {
    this.$store.dispatch('terminal/tickers');
    this.$store.dispatch('terminal/symbols');
    this.$store.dispatch('terminal/positions');
    this.$store.dispatch('terminal/orders');
    this.$store.dispatch('terminal/series');
  },
  render: (h) => h(App),
}).$mount('#app');
