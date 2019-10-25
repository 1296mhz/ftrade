<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  props: {
    source: String,
  },
  data() {
    return {
    };
  },

};
</script>
