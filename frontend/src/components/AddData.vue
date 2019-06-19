<template>
    <!-- content -->
	<div class="content">
		<div class="content-in">
            <!-- Form -->
			<div class="guide-panel">
				<h2 class="page-tit">Add a new data</h2>
                <form @submit.prevent="addData" enctype="multipart/form-data">
                    <section class="box">
                        <div class="tbl form">
                            <table>
                                <caption>데이터</caption>
                                <colgroup>
                                    <col style="width:100px">
                                    <col style="width:*">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>Category</th>
                                        <td>
                                            <select v-model="typeSelected" v-on:change="inputChange">
                                                <option value="" disabled>Please select one</option>
                                                <option v-for="menu in menuList" v-bind:value="menu">{{menu}}</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr v-for="(field, index) in menuFieldList" :key="index">
                                        <th>{{field}}</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" name="field" v-model="form['field' + index]">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Price</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" name="price" v-model="form['price']">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
										<th>File</th>
										<td>
                                            <input type="file" ref="file" class="file-input" @change="selectFile"/>
										</td>
									</tr>
                                </tbody>
                            </table>
                            <div class="tar mt10">
                                <button type="submit" variant="success" class="btn middle  bg-blue">Add Data</button>
                            </div>
                        </div>
                    </section>
                </form>
			</div>
		</div>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'

export default {
    name: 'AddData',
    data() {
        return {
            menuList: this.$store.getters.getStoreMenuList || [],
            menuFieldList: [],
            typeSelected: '',
            form: {
                field0: '',
                field1: '',
                field2: '',
                field3: '',
                field4: '',
                file: '',
                price: ''
            },
        }
    },
    beforeCreate() {
        // console.log("======== ADDDATA beforeCreate recreateToken");
        // 토큰 재발급
		this.$store.dispatch('certifyAccess', {
			accessToken: localStorage.getItem('access_token'),
		}).then(res => {
			try {
                // console.log("======== ADDDATA beforeCreate certifyAccess then :: ", res.data.result)
				if (!res.data.result) this.$router.push('/')
			} catch(err) {
				this.$router.push('/')
			}
        }).catch(err => this.$router.push('/'))
    },
    methods: {
        inputChange() {
            this.$http.post('/api/getFieldsOfDataType', {
                typeName: this.typeSelected
            }).then(res => {
                // console.log("======== ADDDATA inputChange getFieldsOfDataType res :: ", res.data.fieldList)
                this.menuFieldList = res.data.fieldList
            }).catch(err => {
                // console.log("======== ADDDATA inputChange getFieldsOfDataType err :: ", err)
                alert("error :: ", err)
            })
        },
        selectFile() {
            this.form.file = this.$refs.file.files[0]
        },
        async addData(e) {
            var inputLen = $("input[name='field']").length;

            var formData = new FormData();
            formData.append('typeName', this.typeSelected)
            formData.append('field0', this.form.field0)
            formData.append('field1', this.form.field1)
            formData.append('field2', this.form.field2)
            formData.append('field3', this.form.field3)
            formData.append('field4', this.form.field4)
            formData.append('file', this.form.file)
            formData.append('price', this.form.price)

            try {
                const result = await axios.post('/api/addData', formData)
                // console.log("======= ADDDATA result :: ", result)
                alert(result.data.message)
                
                this.typeSelected = ''
                this.form.field0 = ''
                this.form.field1 = ''
                this.form.field2 = ''
                this.form.field3 = ''
                this.form.field4 = ''
                this.form.file = ''
                this.form.price = ''
                this.$refs.file.value = '';
            } catch(err) {
                console.log(err)
            }
        },
    }
}
</script>

