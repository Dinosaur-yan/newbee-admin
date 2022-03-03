<template>
  <div>
    <el-card class="swiper-container">
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleAdd" :icon="Plus">增加</el-button>
          <el-popconfirm
            title="确定删除嘛？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete()"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete">批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>

      <el-table
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="轮播图" width="200">
          <template #default="scope">
            <img style="width: 150px; height: 150px" :src="scope.row.carouselUrl" alt="轮播图" />
          </template>
        </el-table-column>
        <el-table-column label="跳转链接">
          <template #default="scope">
            <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.redirectUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="carouselRank" label="排序值" width="120"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <a
              style="cursor: pointer; margin-right: 10px"
              @click="handleEdit(scope.row.carouselId)"
            >
              修改
            </a>
            <el-popconfirm
              title="确定删除吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete([scope.row])"
            >
              <template #reference>
                <a style="cursor: pointer">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :page-sizes="[10, 50, 20, 100]"
        :current-page="state.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
    <DialogAddSwiper ref="addSwiper" :type="state.type" :reload="getCarousels"></DialogAddSwiper>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import DialogAddSwiper from '@/components/DialogAddSwiper.vue'

const state = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  tableData: [],
  multipleSelection: [],
  type: 'add'
})

const getCarousels = () => {
  axios
    .get('/carousels', {
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
  getCarousels()
})

const handleSizeChange = (val: number) => {
  state.pageSize = val
  getCarousels()
}

const handleCurrentChange = (val: number) => {
  state.currentPage = val
  getCarousels()
}

const addSwiper: any = ref(null)

const handleAdd = () => {
  state.type = 'add'
  addSwiper.value?.open()
}

const handleEdit = (id: number) => {
  state.type = 'edit'
  addSwiper.value?.open(id)
}

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val
}

const handleDelete = (row?: any) => {
  if (row) {
    state.multipleSelection = row
  }

  if (!state.multipleSelection.length) {
    ElMessage.error('请选择项')
    return
  }

  axios
    .delete('/carousels', {
      data: {
        ids: state.multipleSelection.map((i: any) => i.carouselId)
      }
    })
    .then(() => {
      ElMessage.success('删除成功')
      getCarousels()
    })
}
</script>

<style scoped></style>
