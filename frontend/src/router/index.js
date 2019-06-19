import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
  	routes: [
		{
			path: '/',
			name: 'Login',
			component: () =>
				import("@/components/Login")
		}
		, {
			path: '/login',
			name: 'Login',
			component: () =>
				import("@/components/Login")
		}
		, {
			path: '/logout',
			name: 'Logout',
			component: () =>
				import("@/components/Logout")
		}
		, {
			path: '/authLogin',
			name: 'AuthLogin',
			component: () =>
				import("@/components/AuthLogin")
		}
		, {
			path: '/home',
			name: 'Home',
			component: () =>
				import("@/components/Home")
		}
		, {
			path: '/addCategory',
			name: 'AddCategory',
			component: () =>
				import("@/components/AddCategory")
		}
		, {
			path: '/addData',
			name: 'AddData',
			component: () =>
				import("@/components/AddData")
		}
		, {
			path: '/cateDataList/:cate',
			name: 'CateDataList',
			// props: true,
			component: () => 
				import("@/components/CateDataList")
		}
		, {
			path: '/mypageData/:type',
			name: 'MypageData',
			component: () =>
				import("@/components/MypageData")
		}
		, {
			path: '/mypageTransactions',
			name: 'MypageTransactions',
			component: () => 
				import("@/components/MypageTransactions")
		}
		, {
			path: '/test123',
			name: 'TEST123',
			component: () => 
				import("@/components/TEST123")
		}
  	]
})
