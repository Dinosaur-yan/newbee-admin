<template>
  <div class="login-body">
    <div class="login-container">
      <!-- 顶部标题 -->
      <div class="head">
        <img class="logo" src="https://s.weituibao.com/1582958061265/mlogo.png" />
        <div class="name">
          <div class="title">新蜂商城</div>
          <div class="tips">Vue3.0 后台管理系统</div>
        </div>
      </div>
      <!-- 表单 -->
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        class="login-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model.trim="ruleForm.password"
            autocomplete="off"
            @keyup.enter.native="submitForm"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
          <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'
import md5 from 'js-md5'
import axios from '@/utils/axios'
import { localSet } from '@/utils'

const ruleForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: 'true', message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: 'true', message: '密码不能为空', trigger: 'blur' }]
}

const checked = ref(true)

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

// const resetForm = () => {
//   ruleFormRef.value?.resetFields()
// }

const submitForm = async () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      axios
        .post('/adminUser/login', {
          userName: ruleForm.username || '',
          passwordMd5: md5(ruleForm.password)
        })
        .then((res) => {
          localSet('token', res)
          window.location.href = '/'
        })
    } else {
      return false
    }
  })
}
</script>

<style scoped>
.login-body {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
}
.login-container {
  width: 420px;
  height: 530px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 20px 0;
}
.head img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.head .title {
  font-size: 28px;
  color: #1baeae;
  font-weight: bold;
}
.head .tips {
  font-size: 12px;
  color: #999;
}
.login-form {
  width: 70%;
  margin: 0 auto;
}
.login-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form >>> .el-form-item {
  margin-bottom: 18px;
}
</style>
