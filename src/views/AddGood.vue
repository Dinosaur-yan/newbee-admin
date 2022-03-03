<template>
  <div class="add">
    <el-card class="add-container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
        class="goodForm"
      >
        <el-form-item required label="商品分类">
          <el-cascader
            style="width: 300px"
            :placeholder="state.defaultCate"
            :props="category"
            @change="handleChangeCate"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            style="width: 300px"
            v-model="ruleForm.goodsName"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品简介" prop="goodsIntro">
          <el-input
            style="width: 300px"
            type="textarea"
            v-model="ruleForm.goodsIntro"
            placeholder="请输入商品简介(100字)"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="originalPrice">
          <el-input
            type="number"
            min="0"
            style="width: 300px"
            v-model="ruleForm.originalPrice"
            placeholder="请输入商品价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品售卖价" prop="sellingPrice">
          <el-input
            type="number"
            min="0"
            style="width: 300px"
            v-model="ruleForm.sellingPrice"
            placeholder="请输入商品售价"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stockNum">
          <el-input
            type="number"
            min="0"
            style="width: 300px"
            v-model="ruleForm.stockNum"
            placeholder="请输入商品库存"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-input
            style="width: 300px"
            v-model="ruleForm.tag"
            placeholder="请输入商品小标签"
          ></el-input>
        </el-form-item>
        <el-form-item label="上架状态" prop="goodsSellStatus">
          <el-radio-group v-model="ruleForm.goodsSellStatus">
            <el-radio label="0">上架</el-radio>
            <el-radio label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item required label="商品主图" prop="goodsCoverImg">
          <el-upload
            class="avatar-uploader"
            :action="uploadImgServer"
            accept="jpg,jpeg,png"
            :headers="{
              token: state.token
            }"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess"
          >
            <img
              style="width: 100px; height: 100px; border: 1px solid #e9e9e9"
              v-if="ruleForm.goodsCoverImg"
              :src="ruleForm.goodsCoverImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情内容">
          <div ref="editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAdd()">
            {{ ruleForm.id ? '立即修改' : '立即创建' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import WangEditor from 'wangeditor'
import { onMounted, reactive, ref } from 'vue'
import axios from '@/utils/axios'
import { localGet, prefix, uploadImgServer, uploadImgsServer } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

const state = reactive({
  token: localGet('token') || '', // 存在本地的 token
  defaultCate: '请选择', // 默认分类值
  categoryId: 0, // 分类 id
  goodsDetailContent: ''
})

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  id: 0,
  goodsName: '',
  goodsIntro: '',
  originalPrice: '',
  sellingPrice: '',
  stockNum: '',
  goodsSellStatus: '0',
  goodsCoverImg: '',
  tag: ''
})

const rules = {}

const category = reactive({
  // 联动组件 props 属性
  lazy: true,
  lazyLoad(node: any, resolve: any) {
    // 懒加载分类方法
    const { level = 0, value } = node
    axios
      .get('/categories', {
        params: {
          pageNumber: 1,
          pageSize: 1000,
          categoryLevel: level + 1,
          parentId: value || 0
        }
      })
      .then((res: any) => {
        const { list } = res
        const nodes = list.map((item: any) => ({
          value: item.categoryId,
          label: item.categoryName,
          leaf: level > 1
        }))
        resolve(nodes)
      })
  }
})

const route = useRoute()
const router = useRouter()

/**
 * 初始化详情数据
 * @param id
 */
const getDetail = (id: number, editor?: WangEditor) => {
  axios.get(`/goods/${id}`).then((res: any) => {
    const { goods, firstCategory, secondCategory, thirdCategory } = res
    ruleForm.goodsName = goods.goodsName
    ruleForm.goodsIntro = goods.goodsIntro
    ruleForm.originalPrice = goods.originalPrice
    ruleForm.sellingPrice = goods.sellingPrice
    ruleForm.stockNum = goods.stockNum
    ruleForm.goodsSellStatus = String(goods.goodsSellStatus)
    ruleForm.goodsCoverImg = prefix(goods.goodsCoverImg)
    ruleForm.tag = goods.tag
    state.categoryId = goods.goodsCategoryId
    state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
    if (editor) {
      editor.txt.html(goods.goodsDetailContent)
    }
  })
}

const editor = ref(null)

/**
 * 加载 富文本编辑器及配置
 * @param toolbarSelector
 * @param textSelector
 */
const editorInstance = (toolbarSelector: any, textSelector?: any) => {
  const instance = new WangEditor(toolbarSelector, textSelector) // 初始化 wangEditor

  instance.config.showLinkImg = false
  instance.config.showLinkImgAlt = false
  instance.config.showLinkImgHref = false
  instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 最大上传大小 2M
  instance.config.uploadFileName = 'file' // 上传时，key 值自定义
  instance.config.uploadImgHeaders = {
    token: state.token // 添加 token，否则没有权限调用上传接口
  }

  // 图片返回格式不同，需要自定义返回格式
  // instance.config.uploadImgHooks = {}

  instance.config.uploadImgServer = uploadImgsServer // 上传接口地址配置
  Object.assign(instance.config, {
    onchange() {
      // console.log('change')
    }
  })

  return instance
}

let instance: WangEditor
onMounted(() => {
  instance = editorInstance(editor.value)
  instance.create()

  const { id } = route.query
  if (id) {
    const goodId = Number(id)
    ruleForm.id = goodId
    getDetail(goodId, instance)
  }
})

const handleChangeCate = (val: Array<number>) => {
  state.categoryId = val[2] || 0
}

const handleBeforeUpload = (file: any) => {
  const extend = file.name.split('.')[1] || ''
  if (!['jpg', 'jpeg', 'png'].includes(extend)) {
    ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
    return false
  }
}

const handleUrlSuccess = (val: any) => {
  ruleForm.goodsCoverImg = val.data || ''
}

const submitAdd = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      let httpOption = axios.post
      const params = {
        goodsId: 0,
        goodsCategoryId: state.categoryId,
        goodsCoverImg: ruleForm.goodsCoverImg,
        goodsDetailContent: instance.txt.html(),
        goodsIntro: ruleForm.goodsIntro,
        goodsName: ruleForm.goodsName,
        goodsSellStatus: ruleForm.goodsSellStatus,
        originalPrice: ruleForm.originalPrice,
        sellingPrice: ruleForm.sellingPrice,
        stockNum: ruleForm.stockNum,
        tag: ruleForm.tag
      }
      if (ruleForm.id) {
        params.goodsId = ruleForm.id
        // 修改商品使用 put 方法
        httpOption = axios.put
      }
      httpOption('/goods', params).then(() => {
        ElMessage.success(params.goodsId ? '修改成功' : '添加成功')
        router.push({ path: '/good' })
      })
    }
  })
}
</script>

<style scoped>
.add {
  display: flex;
}
.add-container {
  flex: 1;
  height: 100%;
}
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.avatar-uploader-icon {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
}
</style>
