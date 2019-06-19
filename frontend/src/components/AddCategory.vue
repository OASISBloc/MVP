<template>
    <!-- content -->
	<div class="content">
		<div class="content-in">
            <!-- Form -->
			<div class="guide-panel">
				<h2 class="page-tit">Add a new data type</h2>
                <form @submit.prevent="addCategory">
                    <section class="box">
                        <div class="tbl form">
                            <table>
                                <caption>테이블 제목</caption>
                                <colgroup>
                                    <col style="width:100px">
                                    <col style="width:*">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="name" placeholder="Name">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Field1</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="field1" placeholder="Field1">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Field2</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="field2" placeholder="Field2">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Field3</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="field3" placeholder="Field3">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Field4</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="field4" placeholder="Field4">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Field5</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="field5" placeholder="Field5">
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- <tr>
                                        <th>privateKey</th>
                                        <td>
                                            <div class="form-area">
                                                <input type="text" v-model="privateKey" placeholder="PrivateKey">
                                            </div>
                                        </td>
                                    </tr> -->
                                </tbody>
                            </table>
                            <div class="tar mt10">
                                <button type="submit" variant="success" class="btn middle  bg-blue">Add Category</button>
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

export default {
    name: 'AddCategory',
    data() {
        return {
            name: '',
            field1: '',
            field2: '',
            field3: '',
            field4: '',
            field5: '',
            // privateKey: '',
        }
    },
    beforeCreate() {
		// console.log("======== ADDCATEGORY beforeCreate recreateToken");
		this.$store.dispatch('certifyAccess', {
			accessToken: localStorage.getItem('access_token'),
		}).then(res => {
			try {
				// console.log("======== ADDCATEGORY beforeCreate certifyAccess then :: ", res.data.result)
				if (!res.data.result) this.$router.push('/')
			} catch(err) {
				this.$router.push('/')
			}
		}).catch(err => this.$router.push('/'))
	},
    methods: {
        addCategory() {
            if (!this.name || !this.field1 || !this.field2 || !this.field3 || !this.field4 || !this.field5) {
                alert('입력값 모두 입력해 주세요')
                return false
            }

            this.$http.post('/api/addCategory', {
                name: this.name,
                field1: this.field1,
                field2: this.field2,
                field3: this.field3,
                field4: this.field4,
                field5: this.field5,
            })
            .then(res => {
                // console.log("======== ADDCATEGORY login res :: ", res)
                alert(res.data.message)
                this.$router.push({ name: 'Home' })
            }).catch(err => {
                // console.log("======== ADDCATEGORY addCategory err :: ", err)
                alert("Add failed")
            })
        }
    }
}
</script>

