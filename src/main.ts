import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://localhost:3000';
const token = window.localStorage.getItem('token');
Axios.defaults.headers.common['Authorization'] = token;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
