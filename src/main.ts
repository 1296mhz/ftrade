import Vue from 'vue';
import App from './App.vue';
import '@/plugins';
import router from './router';
import { eventBus } from './event-bus';
import vuetify from './plugins/vuetify';
// import HighchartsVue from 'highcharts-vue';
// import Highcharts from 'highcharts';
// import stockInit from 'highcharts/modules/stock';
import store from './store';

Vue.config.productionTip = false;

// stockInit(Highcharts);
// Vue.use(HighchartsVue);
Vue.$log.info(`BACKEND API: ${process.env.VUE_APP_BACKEND_API_URI}`);
Vue.$log.info(`BACKEND SOCKET API: ${process.env.VUE_APP_BACKEND_SOCKET_URI}`);

new Vue({
  router,
  store,
  vuetify,
  created() {
    this.$store.dispatch('terminal/tickers');
    // this.$store.dispatch('terminal/symbols');
    this.$store.dispatch('terminal/positions');
    this.$store.dispatch('terminal/orders');
  },
  render: (h) => h(App),
}).$mount('#app');
