import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/loginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/registerView.vue')
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('../views/resetView.vue'),
    },
    {
      path: '/reset/:token',
      name: 'resetPassword',
      component: () => import('../views/resetPasswordView.vue'),
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem('userToken');
  if (to.matched.some(record => record.meta.requiresAuth) && !userToken) {
    next({ name: 'login' });
  } else if (to.name === 'login' && userToken) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router
