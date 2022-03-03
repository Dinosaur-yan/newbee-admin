<template>
  <el-dialog
    :title="type === 'add' ? '添加分类' : '编辑分类'"
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
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input type="number" v-model="ruleForm.rank"></el-input>
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
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { defineExpose, defineProps, reactive, ref } from 'vue'
import axios from '@/utils/axios'
import { useRoute } from 'vue-router'

const props = defineProps({
  type: {
    type: String,
    default: 'add'
  },
  reload: Function
})

const state = reactive({
  visible: false
})

const route = useRoute()
const { level = 1, parent_id = 0 } = route.query

const ruleForm = reactive({
  id: 0,
  name: '',
  rank: 0
})

const rules = {}

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const getDetail = (id: number) => {
  axios.get(`/categories/${id}`).then((res: any) => {
    ruleForm.name = res.categoryName
    ruleForm.rank = res.categoryRank
  })
}

const open = (id?: number | undefined) => {
  state.visible = true
  if (id) {
    ruleForm.id = id
    getDetail(id)
  } else {
    ruleForm.id = 0
    ruleFormRef.value?.resetFields()
  }
}

const submitForm = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      if (props.type === 'add') {
        // 添加方法
        axios
          .post('/categories', {
            categoryName: ruleForm.name, // 分类名称
            categoryRank: ruleForm.rank, // 分类权重
            categoryLevel: level,
            parentId: parent_id
          })
          .then(() => {
            ElMessage.success('添加成功')
            state.visible = false
            // 接口回调之后，运行重新获取列表方法 reload
            if (props.reload) props.reload()
          })
      } else {
        // 修改方法
        axios
          .put('/categories', {
            categoryId: ruleForm.id,
            categoryName: ruleForm.name,
            categoryRank: ruleForm.rank,
            categoryLevel: level,
            parentId: parent_id
          })
          .then(() => {
            ElMessage.success('修改成功')
            state.visible = false
            // 接口回调之后，运行重新获取列表方法 reload
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
