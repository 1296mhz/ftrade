import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';

Vue.config.productionTip = false;

stockInit(Highcharts);
Vue.use(HighchartsVue);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
