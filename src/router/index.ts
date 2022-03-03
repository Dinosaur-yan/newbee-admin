import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/Layout.vue'
import Category from '@/views/Category.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/layout',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/',
        name: '首页',
        component: () => import('@/views/Index.vue')
      },
      {
        path: '/add-good',
        name: '添加商品',
        component: () => import('@/views/AddGood.vue')
      },
      {
        path: '/swiper',
        name: '轮播图配置',
        component: () => import('@/views/Swiper.vue')
      },
      {
        path: '/hot',
        name: '热销商品配置',
        component: () => import('@/views/IndexConfig.vue')
      },
      {
        path: '/new',
        name: '新品上线配置',
        component: () => import('@/views/IndexConfig.vue')
      },
      {
        path: '/recommend',
        name: '为你推荐配置',
        component: () => import('@/views/IndexConfig.vue')
      },
      {
        path: '/category',
        name: '分类管理',
        component: Category,
        children: [
          {
            path: '/category/level2',
            name: '分类二级管理',
            component: Category
          },
          {
            path: '/category/level3',
            name: '分类三级管理',
            component: Category
          }
        ]
      },
      {
        path: '/good',
        name: '商品管理',
        component: () => import('@/views/Good.vue')
      },
      {
        path: '/order',
        name: '订单管理',
        component: () => import('@/views/Order.vue')
      },
      {
        path: '/guest',
        name: '会员管理',
        component: () => import('@/views/Guest.vue')
      },
      {
        path: '/account',
        name: '修改密码',
        component: () => import('@/views/Account.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
