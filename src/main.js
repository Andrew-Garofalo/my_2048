import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

