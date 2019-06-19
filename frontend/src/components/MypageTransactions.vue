<template>
    <!-- content -->
	<div class="content">
		<div class="content-in">
			<h2 class="page-tit">My Page</h2>
			<ul class="tab type02">
				<li>
					<router-link :to="{ name: 'MypageData', params: { type: 'traded'} }">My Data</router-link>
				</li>
				<li class="active">
					<router-link :to="{ name: 'MypageTransactions' }">Transactions</router-link>
				</li>
			</ul>
			<!-- 본문 -->
			<section class="box">
                <div class="tbl skyblue">
                    <table>
                        <caption>기본 정보</caption>
                        <colgroup>
                            <col style="width:15%">
                            <col style="width:15%">
                            <col style="width:30%">
                            <col style="width:25%">
                            <col style="width:15%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Action ID</th>
                                <th>Block ID</th>
                                <th>Transaction ID</th>
                                <th>Timestamp</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="transaction in transactions">
                                <td>{{transaction[0]}}</td>
                                <td><a v-on:click="outLink(transaction[1])">{{transaction[1]}}</a></td>
                                <td><a v-on:click="outLink(transaction[2])">{{transaction[2]}}</a></td>
                                <td>{{transaction[3]}}</td>
                                <td>{{transaction[4]}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
			<!-- //본문 -->
		</div>
	</div>
	<!-- //content -->
</template>

<script>
export default {
    name: 'Transactions',
    data() {
        return {
            transactions: []
        }
    },
    beforeCreate() {
        this.$store.dispatch('certifyAccess', {
			accessToken: localStorage.getItem('access_token'),
		}).then(res => {
			try {
				if (!res.data.result) this.$router.push('/')
			} catch(err) {
				this.$router.push('/')
			}
		}).catch(err => this.$router.push('/'))
    },
    created() {
        this.$store.dispatch('setHeader', {val: true})

        // 사용자 트랜젝션 조회
        this.$http.post('/api/getActions', {
            account: 'hiya11111111'
        }).then((response) => {
            var result = response.data
            if (result.result === "OK") {
                this.transactions = result.rows
            } else {
                this.transactions = []
                alert(result.message)
            }
        })
    },
    methods: {
        outLink(arg) {
            alert(process.env.EXPLORER_URL)
            window.location.href = process.env.EXPLORER_URL + "/search?q=" + arg
        }
    }
}
</script>

