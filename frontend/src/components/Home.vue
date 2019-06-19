<template>
	<!-- content -->
	<div class="content">
		<div class="content-in">
			<h2 class="page-tit">
				왼쪽 메뉴를 선택하여 데이터 조회 또는 등록해 주세요.
			</h2>
			<h3 class="tit-type01">데이터 등록 계열 처리는 alice 계정으로</h3>
			<h3 class="tit-type01">데이터 다운로드 계열은 bob 계정으로</h3>
			<h3 class="tit-type01">Transactions은 로그인한 계정으로 처리됨</h3>
		</div>
	</div>
	<!-- //content -->
</template>

<script>
export default {
	name: 'Home',
	data () {
		return {
			menuList: [],
		}
	},
	beforeCreate() {
		// console.log("======== HOME beforeCreate");
		this.$store.dispatch('certifyAccess', {
			accessToken: localStorage.getItem('access_token'),
		}).then(res => {
			try {
				// console.log("======== HOME beforeCreate certifyAccess then :: ", res.data.result)
				if (!res.data.result) this.$router.push('/')
			} catch(err) {
				this.$router.push('/')
			}
		}).catch(err => this.$router.push('/'))
	},
}
</script>

