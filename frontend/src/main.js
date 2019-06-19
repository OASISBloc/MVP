// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/store'

Vue.config.productionTip = false
Vue.prototype.$http = axios
const accessToken = localStorage.getItem('access_token')

if (accessToken) {
	// console.log('============ main.js accessToken :: ' + accessToken)
	Vue.prototype.$http.defaults.headers.common['Authorization'] = accessToken
} else {
	// 확인 요!!!!!
	router.push({ name: 'Login' })
}

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
