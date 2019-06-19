<template>
	<div id="app" class="page-wrap">
		<!-- header -->
		<header v-if="headerFlg">
			<h1><router-link :to="{ name: 'Login' }">OASISBloc <span>Market</span></router-link></h1>
			<div v-if="!loggedIn"><router-link :to="{ name: 'Login' }" class="btn-log">Login</router-link></div>
			<div v-if="loggedIn"><router-link :to="{ name: 'Logout' }" class="btn-log">Logout</router-link></div>
			<a href="#n" class="m-menu"><span>All Menu</span></a>
			<div v-if="loggedIn" class="user">
				<span class="info">
					{{account}} / {{tokenAmt}}
				</span>
				<router-link :to="{ name: 'MypageData', params: { type: 'traded'} }" class="btn middle bg-lightseagreen">My Page</router-link>
			</div>

		</header>
		<!-- //header -->
		<div v-if="headerFlg" class="container">
			<!-- aside -->
			<aside>
				<nav>
					<a href="#n" class="btn-close">close</a>
					<router-link :to="{ name: 'AddCategory' }" class="btn-cate bg-skyblue">Add Category</router-link>
					<router-link :to="{ name: 'AddData' }" class="btn-cate bg-blue">AddData</router-link>
					<ul v-for="menu in menuList">
						<li><router-link :to="{ name: 'CateDataList', params: { cate: menu } }">{{menu}}</router-link></li>
					</ul>
				</nav>
			</aside>
			<!-- //aside -->

			<router-view/>

		</div>
		<!-- //container -->

		<div v-if="!headerFlg" class="container">
			<router-view/>
		</div>

		<!-- footer -->
		<footer v-if="headerFlg">
			<p class="foot-msg">Anything you want</p>
			<p class="copyright">Copyright © 2019 <a href="#">Double Chain</a>. All rights reserved.</p>
		</footer>
		<!-- //footer -->
	</div>
</template>

<script>
	import "@/assets/css/common.css"

	export default {
		name: 'App',
		data() {
			return {
				tokenAmt: '0',
				account: null,
				homeUrl: '/home',
				menuList: [],
			}
		},
		created() {
			this.$store.dispatch('getDataTypes')
			.then(res => {
				// console.log("======== APP created getDataTypes :: ", res)
				this.menuList = res.data.menuList
			}).catch(err => {
				alert("failed")
			})
		},
		computed: {
			headerFlg() {
				// console.log("======== APP headerFlg :: ", this.$store.getters.headerFlg)
				const loginChk = this.$store.getters.headerFlg
				if (loginChk) {
					this.account = this.$store.getters.accountIn
				}
				return loginChk
			},
			loggedIn() {
				const loginCheck = this.$store.getters.loggedIn
				// console.log("======== APP loggedIn loginCheck :: ", loginCheck)
				if (loginCheck) {
					// 보유 코인 조희
					this.$http.post('/api/getCurrencyBalance', {
						account: this.$store.getters.accountIn
					}).then((response) => {
						var result = response.data
						// console.log("======== APP getCurrencyBalance :: ", result)
						if (result.result) {
							this.tokenAmt = result.tokenAmt
							this.$store.dispatch('setTokenAmt', {val: result.tokenAmt})
						}
					}).catch(err => {
						alert("failed")
					})
				}
				return loginCheck
			}
		}
	}
</script>
