<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { localGet, localSet } from '@/utils'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'

const router = useRouter()
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else if (localGet('token')) {
    next()
  } else {
    next({ path: 'login' })
  }

  if (!localGet('userInfo')) {
    axios.get('/adminUser/profile').then((res) => {
      localSet('userInfo', res)
    })
  }

  document.title = to.name?.toString() || '新蜂商城'
})
</script>
