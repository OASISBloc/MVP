<template>
    <!-- content -->
	<div class="content">
		<div class="content-in">
			<h2 class="page-tit">My Page</h2>
			<ul class="tab type02">
				<li class="active">
					<router-link :to="{ name: 'MypageData', params: { type: 'traded'} }">My Data</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'MypageTransactions' }">Transactions</router-link>
				</li>
			</ul>
			<!-- 본문 -->
			<section class="box">
				<!-- tab btn -->
				<ul class="tab">
					<li v-bind:class="{active: tActive}"><router-link :to="{ name: 'MypageData', params: { type: 'traded'} }">Traded</router-link></li>
					<li v-bind:class="{active: uActive}"><router-link :to="{ name: 'MypageData', params: { type: 'uploaded'} }">Uploaded</router-link></li>
				</ul>

                <div class="tbl skyblue" v-if="myDataList.length > 0" v-for="(myData, index) in myDataList">
                    <table>
                        <caption>기본 정보</caption>
                        <colgroup>
                    		<col style="width:20%">
                    		<col v-if="type == 'traded'" style="width:10%">
                    		<col style="width:14%">
                    		<col style="width:7%">
                    		<col style="width:12%">
                    		<col style="width:12%">
                    		<col style="width:10%">
                    		<col style="width:10%">
                    		<col style="width:*">
                        </colgroup>
                        <thead>
                            <tr>
                    			<th>Type</th>
                    			<th v-if="type == 'traded'">Provider</th>
                    			<th>DateTime</th>
                    			<th>Price(OSB)</th>
                    			<th>Traded</th>
                    			<th>Traded Date</th>
                    			<th>Status</th>
                    			<th colspan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{myData.type}}</td>
                                <td v-if="type == 'traded'">{{myData.provider}}</td>
                                <td>{{myData.provDatetime}}</td>
                                <td>{{myData.price}}</td>
                                <td>{{myData.traded}}</td>
                                <td>{{myData.tradDatetime}}</td>
                                <td>{{myData.status}}</td>
                                <td>
									<button v-if="type == 'traded'" class="btn small bg-blue" v-on:click="download(myData.ipfs)">Download</button>
									<button v-if="type == 'uploaded' && myData.status == 'off sale'" class="btn small bg-blue" v-on:click="uploadDataRemove(myData.dataid)">remove</button>
								</td>
                                <td><button class="btn small bg-gold" v-on:click="detail(myData.dataid)">Detail</button></td>
                            </tr>
                        </tbody>
                    </table>
                
					<div class="tbl" detailTbl="details" v-bind:id="'details_' + myData.dataid" style="display:none">
						<table>
							<caption>상세 정보</caption>
							<colgroup>
								<col style="width:100px">
								<col style="width:*">
							</colgroup>
							<tbody>
								<tr>
									<th colspan="2">Metadata Info</th>
								</tr>
								<tr>
									<th>title</th>
									<td>{{myData.title}}</td>
								</tr>
								<tr>
									<th>Data Origin</th>
									<td>{{myData.dataOrigin}}</td>
								</tr>
								<tr>
									<th>Period</th>
									<td>{{myData.period}}</td>
								</tr>
								<tr>
									<th>Fomat</th>
									<td>{{myData.format}}</td>
								</tr>
								<tr v-if="type == 'traded'">
									<th>TXID</th>
									<td>TXID</td>
								</tr>
								<tr>
									<th>Expiry Date</th>
									<td>{{myData.expirydate}}</td>
								</tr>
							</tbody>
						</table>
					</div>
                </div>

                <div class="tbl skyblue" v-if="myDataList.length < 1">
                    <table>
                        <caption>기본 정보</caption>
                        <colgroup>
                    		<col style="width:14%">
                    		<col v-if="type == 'traded'" style="width:10%">
                    		<col style="width:16%">
                    		<col style="width:10%">
                    		<col style="width:14%">
                    		<col style="width:16%">
                    		<col style="width:*">
                        </colgroup>
                        <thead>
                            <tr>
                    			<th>Type</th>
                    			<th v-if="type == 'traded'">Provider</th>
                    			<th>DateTime</th>
                    			<th>Price(OSB)</th>
                    			<th>Traded</th>
                    			<th>Traded Date</th>
                    			<th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="7" class="nodata">NO DATA</td>
                            </tr>
                        </tbody>
                    </table>
                                
                </div>
            </section>
			<!-- //본문 -->
		</div>
        <iframe id="fileDown" style='visibility:hidden' src="" width="1" height="1"></iframe>
	</div>
	<!-- //content -->
</template>

<script>
import $ from 'jquery'

export default {
    name: 'Mypage',
    data() {
        return {
			type: '',
			tActive: this.$route.params.type === 'traded' ? 'active' : '',
			uActive: this.$route.params.type === 'uploaded' ? 'active' : '',
			myDataList: [],
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
		this.type = this.$route.params.type
		if (this.type == "traded") {
			// this.tActive = 'active'
			this.getTradedDataList()
		} else {
			// this.uActive = 'active'
			this.getUploadedDataList()
		}
	},
	computed: {
        getCate: function() {
			this.type = this.$route.params.type
			if (this.type == "traded") {
				this.getTradedDataList()
			} else {
				this.getUploadedDataList()
			}
        }
    },
	watch: {
        '$route' (to, from) {
			if (to.params.type == 'uploaded') {
				this.tActive = ''
				this.uActive = 'active'
			} else {
				this.tActive = 'active'
				this.uActive = ''
			}

			$("[detailTbl]").each(function() {
				$(this).hide()
			})

            this.type = to.params.type
        }
    },
	methods: {
		getTradedDataList() {
			this.$http.post('/api/getTradedDataList', {
                account: "bob",
            })
            .then(res => {
                if (res.data.result == 'OK') {
                    this.myDataList = res.data.rows
                } else if (res.data.result == 'NONE') {
                    this.myDataList = []
                }
            }).catch(err => {
                alert("Get traded data failed")
            })
		},
		getUploadedDataList() {
			this.$http.post('/api/getUploadedDataList', {
                account: "alice",
            })
            .then(res => {
                if (res.data.result == 'OK') {
                    this.myDataList = res.data.rows
                } else if (res.data.result == 'NONE') {
                    this.myDataList = []
                }
            }).catch(err => {
                alert("Get traded data failed")
            })
		},
		uploadDataRemove(dataid) {
			this.$http.post('/api/uploadDataRemove', {
				provider: "alice",
				dataid: dataid
            })
            .then(res => {
				alert(res.data.message + "	" + this.type)
				this.$router.push('/mypageData/' + this.type)
            }).catch(err => {
                alert("Get remove data failed")
            })
		},
		download(hash) {
            var url = process.env.IPFS_URL + "/ipfs/" + hash
            $('#fileDown').attr('src', url)
		},
		detail(dataid) {
			$("[detailTbl]").each(function() {
				$(this).hide()
			})
			$("#details_" + dataid).show()
		}
	}
}
</script>

