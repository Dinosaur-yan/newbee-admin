<template>
  <div>
    <el-card>
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleAdd" :icon="Plus">增加</el-button>
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
        <el-table-column prop="categoryName" label="分类名称"></el-table-column>
        <el-table-column prop="categoryRank" label="排序值" width="120"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200"></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <a
              style="cursor: pointer; margin-right: 10px"
              @click="handleEdit(scope.row.categoryId)"
            >
              修改
            </a>
            <a style="cursor: pointer; margin-right: 10px" @click="handleNext(scope.row)">
              下级分类
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
        :curren-page="state.currentPage"
        :page-size="state.pageSize"
        @current-change="changePage"
      ></el-pagination>
    </el-card>

    <DialogAddCategoryVue
      ref="addCategory"
      :type="state.type"
      :reload="reload"
    ></DialogAddCategoryVue>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import DialogAddCategoryVue from '@/components/DialogAddCategory.vue'

const state = reactive({
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  type: 'add',
  visible: false,
  categoryId: 0,
  multipleSelection: []
})

const route = useRoute()
const router = useRouter()

const getCategory = () => {
  const { level = 1, parent_id = 0 } = route.query
  axios
    .get('/categories', {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        categoryLevel: level,
        parentId: parent_id
      }
    })
    .then((res: any) => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
    })
}

onMounted(() => getCategory())

const reload = () => getCategory()

const changePage = (val: number) => {
  state.currentPage = val
  getCategory()
}

const unwatch = router.afterEach((to) => {
  if (to.path && ['/category', '/level2', '/level3'].some((val) => to.path.endsWith(val))) {
    getCategory()
  }
})

onUnmounted(() => unwatch())

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val
}

const addCategory: any = ref(null)

const handleAdd = () => {
  state.type = 'add'
  addCategory.value?.open()
}

const handleEdit = (categoryId: number) => {
  state.type = 'edit'
  addCategory.value?.open(categoryId)
}

const handleNext = (obj: any) => {
  const level = (obj.categoryLevel as number) + 1
  if (level === 4) {
    ElMessage.error('没有下一级')
    return
  }
  router.push({
    path: `/category/level${level}`,
    query: {
      level,
      parent_id: obj.categoryId
    }
  })
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
    .delete('/categories', {
      data: {
        ids: state.multipleSelection.map((i: any) => i.categoryId)
      }
    })
    .then(() => {
      ElMessage.success('删除成功')
      getCategory()
    })
}
</script>

<style scoped></style>
