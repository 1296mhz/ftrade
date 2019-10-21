import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Terminal from './views/Terminal.vue';
import Dashboard from './views/Dashboard.vue';
import store from './store';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: Terminal,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  // console.log(to.params.id);
  console.log(to.name);
  //store.commit(`app/viewComponent`, to.name);
  store.dispatch('app/currentView', to.name );
  next();
});

export default router;