<template>
  <div>
    <el-card>
      <template #header>
        <div class="header">
          <el-button type="primary" :icon="Plus" @click="handleSolve">解除禁用</el-button>
          <el-button type="danger" :icon="Delete" @click="handleForbid">禁用账户</el-button>
        </div>
      </template>

      <Table ref="table" action="/users">
        <template #column>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="nickName" label="昵称"> </el-table-column>
          <el-table-column prop="loginName" label="登录名"> </el-table-column>
          <el-table-column label="身份状态">
            <template #default="scope">
              <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
                {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="是否注销">
            <template #default="scope">
              <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
                {{ scope.row.isDeleted == 0 ? '正常' : '注销' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间"></el-table-column>
        </template>
      </Table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import Table from '@/components/Table.vue'
import axios from '@/utils/axios'

const table: any = ref(null)

const handleSolve = () => {
  if (!table.value.multipleSelection.length) {
    ElMessage.error('请选择项')
    return
  }
  axios
    .put(`/users/0`, {
      ids: table.value.multipleSelection.map((item: any) => item.userId)
    })
    .then(() => {
      ElMessage.success('解除成功')
      // 通过 table 获取组件内部的 getList 方法
      table.value.getList()
    })
}

const handleForbid = () => {
  if (!table.value.multipleSelection.length) {
    ElMessage.error('请选择项')
    return
  }
  axios
    .put(`/users/1`, {
      ids: table.value.multipleSelection.map((item: any) => item.userId)
    })
    .then(() => {
      ElMessage.success('禁用成功')
      // 通过 table 获取组件内部的 getList 方法
      table.value.getList()
    })
}
</script>

<style scoped></style>
