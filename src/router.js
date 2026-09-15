import Vue from 'vue'
import VueRouter from 'vue-router'

import Poem from './views/Poem.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'index', component: Poem },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
