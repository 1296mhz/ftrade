import Vue from 'vue';
import Router from 'vue-router';
import Root from './views/Root.vue';
import Terminal from './views/Terminal.vue';
import Scripts from './views/Scripts.vue';
import Accounts from './views/Accounts.vue';
import Strategies from './views/Strategies.vue';
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
      redirect: '/strategies',
      children: [
        {
          path: '/terminal',
          name: 'Terminal',
          component: Terminal,
        },
        {
          path: '/scripts',
          name: 'Scripts',
          component: Scripts,
        },
        {
          path: '/accounts',
          name: 'Accounts',
          component: Accounts,
        },
        {
          path: '/strategies',
          name: 'Strategies',
          component: Strategies,
        },
      ],
    },

  ],
  mode: 'history',
});

// Router handler
router.beforeEach( async (to, from, next) => {
  document.title = to.name;

  if (store.state.connected && to.path === '/login') {
    return next('/');
  }

  // Check connection state
  // if (!store.state.connected && to.path !== '/login')
  if (store.state.connected && to.path !== '/login') {
    // Try connect
    try {
      await store.dispatch('Connect');
      // await store.dispatch('GetVAccounts');
    } catch (err) {
      // Goto login page
      return next('/login');
    }
  }

  next();
});

export default router;
