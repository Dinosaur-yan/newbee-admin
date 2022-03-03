<template>
  <div>
    <el-card class="account-container">
      <el-form
        :model="nameForm"
        :rules="rules"
        ref="nameRef"
        label-width="80px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="登录名：" prop="loginName">
          <el-input style="width: 200px" v-model="nameForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickName">
          <el-input style="width: 200px" v-model="nameForm.nickName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitName">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="account-container">
      <el-form
        :model="passForm"
        :rules="rules"
        ref="passRef"
        label-width="80px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码：" prop="oldPass">
          <el-input style="width: 200px" v-model="passForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPass">
          <el-input style="width: 200px" v-model="passForm.newPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitPass">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'
import md5 from 'js-md5'
import axios from '@/utils/axios'

type FormInstance = InstanceType<typeof ElForm>
const rules = {
  loginName: [{ required: 'true', message: '登录名不能为空', trigger: ['change'] }],
  nickName: [{ required: 'true', message: '昵称不能为空', trigger: ['change'] }],
  oldPass: [{ required: 'true', message: '原密码不能为空', trigger: ['change'] }],
  newPass: [{ required: 'true', message: '新密码不能为空', trigger: ['change'] }]
}

const nameRef = ref<FormInstance>()
const nameForm = reactive({
  loginName: '',
  nickName: ''
})
const submitName = () => {
  nameRef.value?.validate((valid) => {
    if (valid) {
      axios
        .put('/adminUser/name', {
          loginUserName: nameForm.loginName,
          nickName: nameForm.nickName
        })
        .then(() => {
          ElMessage.success('修改成功')
          window.location.reload()
        })
    }
  })
}

const passRef = ref<FormInstance>()
const passForm = reactive({
  oldPass: '',
  newPass: ''
})
const submitPass = () => {
  passRef.value?.validate((valid) => {
    if (valid) {
      axios
        .put('/adminUser/password', {
          originalPassword: md5(passForm.oldPass),
          newPassword: md5(passForm.newPass)
        })
        .then(() => {
          ElMessage.success('修改成功')
          window.location.reload()
        })
    }
  })
}
</script>

<style scoped></style>
