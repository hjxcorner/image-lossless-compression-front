import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import FormatConversion from '../views/FormatConversion.vue'
import ImageCompression from '../views/ImageCompression.vue'
import PersonalCenter from '../views/PersonalCenter.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {path: '/', component: ImageCompression},
  {path: '/conversion', component: FormatConversion},
  {path: '/personal', component: PersonalCenter},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
