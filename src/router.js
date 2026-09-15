import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Mod from './views/Mod.vue'
import Joining from './views/Joining.vue'
import Beast from './views/Beast.vue'
import PartyView from './views/PartyView.vue'

Vue.use(VueRouter)

// Route names/paths mirror the old Nuxt file-based routes, since app code
// pushes to some of these by name (e.g. 'party-party', matching Nuxt's
// auto-generated name for pages/party/_party/index.vue).
const routes = [
  { path: '/', name: 'index', component: Home },
  { path: '/mod', name: 'mod', component: Mod },
  { path: '/joining', name: 'joining', component: Joining },
  { path: '/beast', name: 'beast', component: Beast },
  { path: '/party/:party', name: 'party-party', component: PartyView },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
