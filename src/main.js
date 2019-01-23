import Vue from 'vue'

//bootstrap styles and js
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue'
import store from './store'

Vue.config.productionTip = false


new Vue({
    render: h => h(App),
    store
}).$mount('#app')
