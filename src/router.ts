import Vue from 'vue';
import Router from 'vue-router';
import Root from './views/Root.vue';
import Terminal from './views/Terminal.vue';
import Scripts from './views/Scripts.vue';
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
      component: Root,
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
          path: '/scripts',
          name: 'scripts',
          component: Scripts,
        },
      ],
    },

  ],
  mode: 'history',
});

// Router handler
router.beforeEach( async (to, from, next) => {

  if (store.state.connected && to.path === '/login') {
    return next('/');
  }

  // Check connection state
  if (!store.state.connected && to.path !== '/login') {
    // Try connect
    try {
      await store.dispatch('Connect');
      await store.dispatch('GetAccounts');
    } catch (err) {
      // Goto login page
      return next('/login');
    }
  }

  next();
});

export default router;
