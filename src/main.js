import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueBarcode from 'vue-barcode'
import './plugins/element.js'
import VueCookies from 'vue-cookies'
import { sha224 } from 'js-sha256';
Vue.use(VueCookies)
Vue.prototype.$sha224 = sha224;
Vue.prototype.$http = axios;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.component('barcode', VueBarcode);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
