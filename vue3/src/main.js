import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/scss/bootstrap.scss'
import './assets/bootstrap.custom.scss'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mitt from 'mitt'
import {createPinia} from "pinia";
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia();


const app = createApp(App)

app.use(router)
app.config.globalProperties.$axios = axios
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$EventBus = new mitt()
app.use(pinia);
pinia.use(piniaPluginPersist)
app.mount('#app')
