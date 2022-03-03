<template>
  <el-dialog
    :title="type === 'add' ? '添加商品' : '修改商品'"
    v-model="state.visible"
    width="400px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormRef"
      label-width="100px"
      class="good-form"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input type="text" v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input type="text" v-model="ruleForm.link" />
      </el-form-item>
      <el-form-item label="商品编号" prop="id">
        <el-input type="number" v-model="ruleForm.id" />
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input type="number" v-model="ruleForm.sort" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="state.visible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import axios from '@/utils/axios'

const props = defineProps({
  type: {
    type: String,
    default: 'add'
  },
  configType: Number,
  reload: Function
})

const state = reactive({
  visible: false,
  id: 0
})

const ruleForm = reactive({
  id: 0,
  name: '',
  link: '',
  sort: 0
})

const rules = {
  id: [{ required: 'true', message: '编号不能为空', trigger: 'change' }],
  name: [{ required: 'true', message: '名称不能为空', trigger: 'change' }],
  sort: [{ required: 'true', message: '排序不能为空', trigger: 'change' }]
}

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const getDetail = (id: number) => {
  axios.get(`/indexConfigs/${id}`).then((res: any) => {
    ruleForm.id = res.goodsId
    ruleForm.name = res.configName
    ruleForm.link = res.redirectUrl
    ruleForm.sort = res.configRank
  })
}

const open = (id?: number | undefined) => {
  state.visible = true
  if (id) {
    state.id = id
    getDetail(id)
  } else {
    ruleForm.id = 0
    ruleForm.name = ''
    ruleForm.link = ''
    ruleForm.sort = 0
  }
}

const submitForm = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      // if (ruleForm.id < 0 || ruleForm.id > 200) {
      //   ElMessage.error('商品编号不能小于 0 或大于 200')
      //   return
      // }

      if (props.type === 'add') {
        axios
          .post('/indexConfigs', {
            configType: props.configType || 3,
            configName: ruleForm.name,
            redirectUrl: ruleForm.link,
            goodsId: ruleForm.id,
            configRank: ruleForm.sort
          })
          .then(() => {
            ElMessage.success('添加成功')
            state.visible = false
            if (props.reload) props.reload()
          })
      } else {
        axios
          .put('/indexConfigs', {
            configId: state.id,
            configType: props.configType || 3,
            goodsId: ruleForm.id,
            configName: ruleForm.name,
            redirectUrl: ruleForm.link,
            configRank: ruleForm.sort
          })
          .then(() => {
            ElMessage.success('修改成功')
            state.visible = false
            if (props.reload) props.reload()
          })
      }
    }
  })
}

defineExpose({
  open
})
</script>

<style scoped></style>
