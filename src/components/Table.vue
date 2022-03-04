<template>
  <div>
    <el-table
      style="width: 100%"
      tooltip-effect="dark"
      :data="state.tableData"
      @selection-change="handleSelectionChange"
    >
      <slot name="column"></slot>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.total"
      :page-size="state.pageSize"
      :current-page="state.currentPage"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, onMounted, reactive, ref } from 'vue'
import axios from '@/utils/axios'

const props = defineProps({
  action: {
    type: String,
    require: true,
    default: ''
  }
})

const state = reactive({
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10
})

const multipleSelection = ref([])

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const getList = () => {
  axios
    .get(props.action, {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize
      }
    })
    .then((res: any) => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
    })
}

onMounted(() => {
  getList()
})

const changePage = (val: number) => {
  state.currentPage = val
  getList()
}

defineExpose({
  multipleSelection,
  getList
})
</script>

<style scoped></style>
