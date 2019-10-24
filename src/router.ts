import Vue from 'vue';
import Router from 'vue-router';
import Dash from './views/Dash.vue';
import Terminal from './views/Terminal.vue';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import store from './store';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'main',
      component: Dash,
      children: [
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
    },

  ],
  mode: 'history',
});

// check auth
router.beforeEach((to, from, next) => {
  const loggedIn = store.state.auth.token;
  console.log("Token: ", loggedIn)
  if (!loggedIn && to.path !== '/login') {
    return next('/login');
  }
  if (loggedIn && to.path === '/login') {
    return next('/');
  }
  next();
});

router.beforeEach((to, from, next) => {
  // console.log(to.params.id);
  console.log("This route", to.name);
  //store.commit(`app/viewComponent`, to.name);
  store.dispatch('app/currentView', to.name);
  next();
});

export default router;