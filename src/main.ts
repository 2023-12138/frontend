import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './routes'
import { createPinia } from 'pinia'

export const baseUrl = "http://127.0.0.1:8000"
createApp(App).use(createPinia()).use(router).mount('#app')
