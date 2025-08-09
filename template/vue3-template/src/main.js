import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import {createRouter, createWebHistory} from 'vue-router'
import 'virtual:svg-icons-register'


const routes = [
  {path: '/', component: App},
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

const app = createApp(App)

app.use(router).mount('#app')
