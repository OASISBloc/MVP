<template>
    <div class="login-box">
		<h1 class="logo"><img src="../assets/img/logo.png" alt="OASISBloc"></h1>
		<form @submit.prevent="login">
            <div class="log-iniput">
                <input type="text" v-model="account" placeholder="ID">
                <input type="password" v-model="password" placeholder="PASSWORD">
                <button type="submit" variant="success" class="btn large bg-blue">LOGIN</button>
            </div>
		</form>
	</div>
</template>

<script>
import axios from 'axios'
import "@/assets/css/login.css"

export default {
    name: 'Login',
    data() {
        return {
            account: '',
            password: ''
        }
    },
    beforeCreate() {
        const accessToken = localStorage.getItem('access_token')
        // console.log("======== LOGIN beforeCreate accessToken :: ", accessToken)
        if (accessToken) this.$router.push({ name: 'Home'})
    },
    created() {
        // console.log("======== LOGIN created");
        this.$store.dispatch('setHeader', {val: false})
    },
    methods: {
        login() {
            const account = this.account
            const password = this.password

            if (!account || !password) {
                alert('아이디, 비밀번호를 입력해 주세요.')
                return false
            }

            this.$store.dispatch('retrieveToken', {
                account: this.account,
                password: this.password
            }).then(res => {
                this.$router.push({ name: 'Home' })
            })
        }
    },
}
</script>