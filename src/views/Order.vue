<template>
  <div>
    <el-card class="order-container">
      <template #header>
        <el-input
          style="width: 200px; margin-right: 12px"
          placeholder="请输入订单号"
          v-model="state.orderNo"
          @change="handleOption"
          clearable
        ></el-input>
        <el-select
          style="width: 200px; margin-right: 12px"
          placeholder="请选择"
          v-model="state.orderStatus"
          @change="handleOption"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" :icon="House" @click="handleConfig()">配货完成</el-button>
        <el-button type="primary" :icon="Van" @click="handleSend()">出库</el-button>
        <el-button type="danger" :icon="Delete" @click="handleClose()">关闭订单</el-button>
      </template>

      <el-table
        width="100%"
        tooltip-effect="dark"
        :data="state.tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="totalPrice" label="订单总价"></el-table-column>
        <el-table-column label="订单状态">
          <template #default="scope">
            <span>{{ orderMap(scope.row.orderStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template #default="scope">
            <span v-if="scope.row.payType == 1">微信支付</span>
            <span v-else-if="scope.row.payType == 2">支付宝支付</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-popconfirm
              v-if="scope.row.orderStatus == 1"
              title="确定配货完成吗？"
              @confirm="handleConfig(scope.row.orderId)"
            >
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">配货完成</a>
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="scope.row.orderStatus == 2"
              title="确定出库吗？"
              @confirm="handleSend(scope.row.orderId)"
            >
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">出库</a>
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="!(scope.row.orderStatus == 4 || scope.row.orderStatus < 0)"
              title="确定关闭订单吗？"
              @confirm="handleClose(scope.row.orderId)"
            >
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">关闭订单</a>
              </template>
            </el-popconfirm>
            <router-link :to="{ path: '/order_detail', query: { id: scope.row.orderId } }">
              订单详情
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Delete, House, Van } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import axios from '@/utils/axios'

const state = reactive({
  tableData: [],
  multipleSelection: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  orderNo: '',
  orderStatus: ''
})

const options = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 0,
    label: '待支付'
  },
  {
    value: 1,
    label: '已支付'
  },
  {
    value: 2,
    label: '配货完成'
  },
  {
    value: 3,
    label: '出库成功'
  },
  {
    value: 4,
    label: '交易成功'
  },
  {
    value: -1,
    label: '手动关闭'
  },
  {
    value: -2,
    label: '超时关闭'
  },
  {
    value: -3,
    label: '商家关闭'
  }
]

const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '配货完成',
  3: '出库成功',
  4: '交易成功',
  '-1': '手动关闭',
  '-2': '超时关闭',
  '-3': '商家关闭'
}

const orderMap = (status: number | string) => orderStatus[status]

const getOrderList = () => {
  axios
    .get('/orders', {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        orderNo: state.orderNo,
        orderStatus: state.orderStatus
      }
    })
    .then((res: any) => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
    })
}

onMounted(() => {
  getOrderList()
})

const handleOption = () => {
  state.currentPage = 1
  getOrderList()
}

const handleCmd = (url: string, msg: string, id?: number | undefined) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = state.multipleSelection.map((i: any) => i.orderId)
  }
  axios.put(url, { ids: params }).then(() => {
    ElMessage.success(msg)
    getOrderList()
  })
}

const handleConfig = (id?: number | undefined) => {
  handleCmd('/orders/checkDone', '配货成功', id)
}

const handleSend = (id?: number | undefined) => {
  handleCmd('/orders/checkOut', '出库成功', id)
}

const handleClose = (id?: number | undefined) => {
  handleCmd('/orders/close', '关闭成功', id)
}

const changePage = (val: number) => {
  state.currentPage = val
  getOrderList()
}

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val
}
</script>

<style scoped></style>
