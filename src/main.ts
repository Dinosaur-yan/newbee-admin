import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router/index'

import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router).use(ElementPlus, { size: 'default', zIndex: 3000 }).mount('#app')
