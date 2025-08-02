import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// 导入 Firebase 初始化文件（执行 Firebase 初始化，无需显式使用导出的变量）
import './firebase/init.js'

// 初始化 Vue 应用
const vueApp = createApp(App)

// 配置 PrimeVue 主题
vueApp.use(PrimeVue, { theme: { preset: Aura } })
vueApp.use(router)

vueApp.mount('#app')