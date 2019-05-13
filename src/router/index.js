import Vue from 'vue'
import Router from 'vue-router'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/pages/login'),
      hidden: true,
    },
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
      meta: {
        requireAuth: true,  // 判断是否需要登录
      },
      component: () => import('@/pages/manage'),
      children: [
        {
          path: '/user',
          component: () => import('@/pages/user'),
        }, 
        {
          path: '/index',
          component: () => import('@/pages/index'),
        },
        {
          path: '/search',
          component: () => import('@/pages/search'),
        },
        {
          path: '/busline',
          component: () => import('@/pages/busline'),
        },
      ]
    },
    
  ],
  mode:"history"
})
