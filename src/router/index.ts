import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/result',
      name: 'landing',
      component: () => import('@/views/Landing.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/Chart.vue')
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('@/views/Wishlist.vue')
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/Payment.vue')
    },
    {
      path: '/terms-and-conditions',
      name: 'terms',
      component: () => import('@/views/Terms.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    const app = document.getElementById('app')
    if (app) {
      const top = app.offsetTop
      app.scrollTo(0, top)
    }
    setTimeout(() => {
      return { x: 0, y: 0 }
    }, 100)
  }
})

export default router
