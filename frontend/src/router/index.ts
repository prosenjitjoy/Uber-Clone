import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/directions',
      name: 'directions',
      component: () => import("../views/DirectionView.vue")
    },
    {
      path: '/map',
      name: 'map',
      component: () => import("../views/MapView.vue")
    },
  ]
})

export default router
