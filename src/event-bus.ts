import Vue from 'vue';
export const eventBus = new Vue();

eventBus.$on('error', (data) => {
  Vue.$log.error(data);
  Vue.$toast.error(data, {
    position: 'top-right',
  });
});

eventBus.$on('info', (data) => {
  Vue.$log.info(data);
  Vue.$toast.success(data, {
    position: 'top-right',
  });
});

eventBus.$on('debug', (data) => {
  Vue.$log.debug(data);
});

eventBus.$on('warn', (data) => {
  Vue.$log.warn(data);
  Vue.$toast.warning(data, {
    position: 'top-right',
  });
});

