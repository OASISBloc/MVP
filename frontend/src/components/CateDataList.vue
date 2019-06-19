<template>
    <!-- content -->
	<div class="content">
		<div class="content-in">
			<h2 class="page-tit">
				{{$route.params.cate}}
				<!-- <span class="desc">Preview of simple data</span> -->
			</h2>
			<!-- 본문 -->
			<section class="box" v-if="cateDataList.length > 0" v-for="cateData in cateDataList">
                <div class="tbl skyblue">
                    <table>
                        <caption>기본 정보</caption>
                        <colgroup>
                            <col style="width:22%">
                            <col style="width:35%">
                            <col style="width:22%">
                            <col style="width:21%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Datetime</th>
                                <th>Price (OSB)</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{cateData.provider}}</td>
                                <td>{{cateData.provDatetime}}</td>
                                <td>{{cateData.price}}</td>
                                <td>{{cateData.status}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tbl">
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
                                <td>{{cateData.title}}</td>
                            </tr>
                            <tr>
                                <th>Data Origin</th>
                                <td>{{cateData.dataOrigin}}</td>
                            </tr>
                            <tr>
                                <th>Period</th>
                                <td>{{cateData.period}}</td>
                            </tr>
                            <tr>
                                <th>Fomat</th>
                                <td>{{cateData.format}}</td>
                            </tr>
                            <tr>
                                <th>Expiry Date</th>
                                <td>{{cateData.expirydate}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tac mt10">
                    <button variant="success" class="btn small bg-gold" v-on:click="trading(cateData.dataid)">Trading</button>
                    <button variant="success" class="btn small bg-blue" v-on:click="download(cateData.ipfs)">Download</button>
                </div>
            </section>

            <section class="box" v-if="cateDataList.length < 1">
                <div class="tbl skyblue">
                    <table>
                        <caption>기본 정보</caption>
                        <colgroup>
                            <col style="width:22%">
                            <col style="width:35%">
                            <col style="width:22%">
                            <col style="width:21%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Datetime</th>
                                <th>Price (OSB)</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5" class="nodata">NO DATA</td>
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
    name: 'CateDataList',
    data() {
        return {
            cate: '',
            cateDataList: []
        }
    },
    beforeCreate() {
        // 토큰 재발급
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
        this.cate = this.$route.params.cate
        this.getCateDataList()
    },
    computed: {
        getCate: function() {
            this.cate = this.$route.params.cate
            this.getCateDataList()
        }
    },
    watch: {
        '$route' (to, from) {
            this.cate = to.params.cate
            this.getCateDataList()
        }
    },
    methods: {
        getCateDataList() {
            this.$http.post('/api/getCateDataList', {
                cate: this.cate,
            })
            .then(res => {
                if (res.data.result == 'OK') {
                    this.cateDataList = res.data.rows
                } else if (res.data.result == 'NONE') {
                    this.cateDataList = []
                }
            }).catch(err => {
                alert("Get data failed")
            })
        },
        trading(dataId) {
            if (confirm("거래하시겠습니까??")) {
                this.$http.post('/api/purchase', {
                    account: 'bob',
                    dataid: dataId
                }).then((response) => {
                    var result = response.data
                    alert(result.message)
                }).catch(err => {
                    alert("failed")
                })
            }
        },
        download(hash) {
            var url = process.env.IPFS_URL + "/ipfs/" + hash
            $('#fileDown').attr('src', url)
        }
    },
    
    
}
</script>

