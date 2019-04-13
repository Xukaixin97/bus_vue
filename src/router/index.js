import Vue from 'vue'
import Router from 'vue-router'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/login'),
      hidden: true,
    },
    {
      path: '/register',
      component: () => import('@/pages/register'),
      hidden: true,
    },
    {
      path: '/manage',
      component: () => import('@/pages/manage'),
      children: [
        {
          path: '/user',
          component: () => import('@/pages/user'),
        }, 
        {
          path: '/search',
          component: () => import('@/pages/search'),
        },
        {
          path: '/busline',
          component: () => import('@/pages/busline'),
        },
        {
          path: '/updateInfo',
          component: () => import('@/pages/updateInfo'),
        },
      ]
    },
    
  ]
})
