<template>
  <div>
    <el-card class="index-container">
      <template #header>
        <div class="header">
          <el-button type="primary" :icon="Plus" @click="handleAdd">增加</el-button>
          <el-popconfirm
            title="确定删除吗？"
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
        style="width: 100%"
        tooltip-effect="dark"
        :data="state.tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品名称" prop="configName"></el-table-column>
        <el-table-column label="跳转链接">
          <template #default="scope">
            <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.redirectUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column label="排序值" prop="configRank" width="120"></el-table-column>
        <el-table-column label="商品编号" prop="goodsId" width="200"></el-table-column>
        <el-table-column label="添加时间" prop="createTime" width="200"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.configId)">
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
        :current-size="state.currentPage"
        @current-change="changePage"
      ></el-pagination>
    </el-card>

    <DialogAddGood
      ref="addGood"
      :reload="getIndexConfig"
      :type="state.type"
      :configType="state.configType"
    ></DialogAddGood>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import DialogAddGood from '@/components/DialogAddGood.vue'

enum ConfigType {
  hot = 3,
  new = 4,
  recommend = 5
}

const state = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  tableData: [],
  type: 'add',
  configType: ConfigType.hot,
  multipleSelection: []
})

const getIndexConfig = () => {
  axios
    .get('/indexConfigs', {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        configType: state.configType
      }
    })
    .then((res: any) => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
    })
}

const changePage = (val: number) => {
  state.currentPage = val
  getIndexConfig()
}

const routerPaths: Array<String> = []

const router = useRouter()

onMounted(() => {
  for (const item in ConfigType) {
    if (!/^\d+$/.test(item)) {
      routerPaths.push(item)
    }
  }
  getIndexConfig()
})

router.beforeEach((to) => {
  const path = to.path.replace('/', '')
  if (routerPaths.includes(path)) {
    state.configType = ConfigType[path]
    state.currentPage = 1
    getIndexConfig()
  }
})

const addGood: any = ref(null)

const handleAdd = () => {
  state.type = 'add'
  addGood.value?.open()
}

const handleEdit = (id: number) => {
  state.type = 'edit'
  addGood.value?.open(id)
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
    .delete('/indexConfigs', {
      data: {
        ids: state.multipleSelection.map((i: any) => i.configId)
      }
    })
    .then(() => {
      ElMessage.success('删除成功')
      getIndexConfig()
    })
}
</script>

<style scoped></style>
