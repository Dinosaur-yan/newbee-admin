<template>
  <div class="layout">
    <el-container class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <img src="//s.weituibao.com/1582958061265/mlogo.png" alt="logo" />
            <span>vue3 admin</span>
          </div>
        </div>
        <div class="line"></div>
        <el-menu
          background-color="#222832"
          text-color="#fff"
          :router="true"
          :default-openeds="defaultOpen"
          :default-active="currentPath"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/">
                <el-icon><Odometer /></el-icon>首页
              </el-menu-item>
              <el-menu-item index="/add-good">
                <el-icon><Plus /></el-icon>添加商品
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper">
                <el-icon><Picture /></el-icon>轮播图配置
              </el-menu-item>
              <el-menu-item index="/hot">
                <el-icon><Star /></el-icon>热销商品配置
              </el-menu-item>
              <el-menu-item index="/new">
                <el-icon><Sell /></el-icon>新品上线配置
              </el-menu-item>
              <el-menu-item index="/recommend">
                <el-icon><Trophy /></el-icon>为你推荐配置
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <span>模块管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/category">
                <el-icon><Menu /></el-icon>分类管理
              </el-menu-item>
              <el-menu-item index="/good">
                <el-icon><Goods /></el-icon>商品管理
              </el-menu-item>
              <el-menu-item index="/order">
                <el-icon><Notebook /></el-icon>订单管理
              </el-menu-item>
              <el-menu-item index="/guest">
                <el-icon><Stamp /></el-icon>会员管理
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/account">
                <el-icon><Lock /></el-icon>修改密码
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header></Header>
        <div class="main">
          <router-view></router-view>
        </div>
        <Footer></Footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import {
  Goods,
  Lock,
  Menu,
  Notebook,
  Odometer,
  Picture,
  Plus,
  Sell,
  Stamp,
  Star,
  Trophy
} from '@element-plus/icons-vue'

let currentPath = '/'

const defaultOpen = ['1', '2', '3', '4']

const router = useRouter()
router.beforeEach((to) => {
  currentPath = to.path
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}
.container {
  height: 100vh;
}
.aside {
  width: 200px !important;
  background-color: #222832;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}
.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #ffffff;
}
.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}
.main {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.el-menu {
  border-right: none !important;
}
.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.el-submenu:first-child {
  border-top: none;
}
.el-submenu [class^='el-icon-'] {
  vertical-align: -1px !important;
}
a {
  color: #409eff;
  text-decoration: none;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.el-popper__arrow {
  display: none;
}
</style>
