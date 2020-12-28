import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import Toast from './components/common/toast/index'
import fastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.prototype.$bus = new Vue()
//初始化FastClick实例。在页面的DOM文档加载完成后
fastClick.attach(document.body)

//图片懒加载
Vue.use(VueLazyload,{
  loading: require('assets/img/common/placeholder.png'),
})

Vue.use(Toast)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
