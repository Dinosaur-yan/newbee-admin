<template>
  <el-dialog
    :title="type === 'add' ? '添加轮播图' : '修改轮播图'"
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
      <el-form-item label="图片" prop="url">
        <el-upload
          class="avatar-uploader"
          accept="jpg,jpeg,png"
          :action="state.uploadImgServer"
          :headers="{ token: state.token }"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
        >
          <img
            style="width: 200px; height: 100px; border: 1px solid #e9e9e9"
            class="avatar"
            v-if="ruleForm.url"
            :src="ruleForm.url"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input type="text" v-model="ruleForm.link"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input type="number" v-model="ruleForm.sort"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button typeof="primary" @click="submitForm">确定</el-button>
        <el-button @click="state.visible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { localGet } from '@/utils'
import axios from '@/utils/axios'

const props = defineProps({
  type: {
    type: String,
    default: 'add'
  },
  reload: Function
})

const state = reactive({
  token: localGet('token') || '',
  uploadImgServer: '/api/upload/file',
  visible: false
})

const ruleForm = reactive({
  id: 0,
  url: '',
  link: '',
  sort: 0
})

const rules = {
  url: [{ required: 'true', message: '图片不能为空', trigger: ['change'] }],
  sort: [{ required: 'true', message: '排序不能为空', trigger: ['change'] }]
}

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const getDetail = (id: number) => {
  axios.get(`/carousels/${id}`).then((res: any) => {
    ruleForm.url = res.carouselUrl
    ruleForm.link = res.redirectUrl
    ruleForm.sort = res.carouselRank
  })
}

const open = (id: number | undefined) => {
  state.visible = true
  if (id) {
    ruleForm.id = id
    getDetail(id)
  } else {
    ruleForm.id = 0
    ruleForm.url = ''
    ruleForm.link = ''
    ruleForm.sort = 0
  }
}

const handleBeforeUpload = (file: File) => {
  const extension = file.name.split('.')[1] || ''
  if (!['jpg', 'jpeg', 'png'].includes(extension)) {
    ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
    return false
  }
}

const handleUploadSuccess = (val: any) => {
  ruleForm.url = val.data || ''
}

const submitForm = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      if (props.type === 'add') {
        axios
          .post('/carousels', {
            carouselUrl: ruleForm.url,
            redirectUrl: ruleForm.link,
            carouselRank: ruleForm.sort
          })
          .then(() => {
            ElMessage.success('添加成功')
            state.visible = false
            if (props.reload) props.reload()
          })
      } else {
        axios
          .put('/carousels', {
            carouselId: ruleForm.id,
            carouselUrl: ruleForm.url,
            redirectUrl: ruleForm.link,
            carouselRank: ruleForm.sort
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

<style scoped>
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
