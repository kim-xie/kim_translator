import Vue from 'vue'
import Store from './store/store.js'
import Fly from 'flyio/dist/npm/wx'
import App from './App'
import '../static/animate.css'

Vue.config.productionTip = false
App.mpType = 'app'

const fly = new Fly

Vue.prototype.$store = Store
Vue.prototype.$fly = fly

const app = new Vue(App)
app.$mount()
