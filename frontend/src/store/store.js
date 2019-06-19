import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { access, stat } from 'fs';
import { resolve } from 'url';
//import { LOGIN } from './mutaion_types'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: localStorage.getItem('access_token') || null,
        currentUser: {},
        headerFlg: false,
        account: null,
        tokenAmt: '0',
        menuList: [],
        selcCate: '',
    },
    getters: {
        headerFlg(state) {
            return state.headerFlg
        },
        loggedIn(state) {
            return state.accessToken !== null
        },
        accountIn(state) {
            return state.account
        },
        getTokenAmt(state) {
            return state.tokenAmt
        },
        getStoreMenuList(state) {
            return state.menuList
        }
    },
    mutations: {
        setHeader(state, flg) {
            state.headerFlg = flg
        },
        retrieveToken(state, accessToken) {
            state.accessToken = accessToken
        },
        setAccout(state, account) {
            state.account = account
        },
        destroyToken(state) {
            state.accessToken = null
        },
        setTokenAmt(state, tokenAmt) {
            state.tokenAmt = tokenAmt
        },
        setDataTypes(state, menuList) {
            state.menuList = menuList
        }
    },
    actions: {
        // 로그인 후 해더 정보 표시/비표시
        setHeader(context, credential) {
            context.commit('setHeader', credential.val)
        },
        // 로그인 인증
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/api/auth/login', {
                                                account: credentials.account,
                                                password: credentials.password
                                            }
                ).then(res => {
                    // console.log("======= STORE login res :: " + JSON.stringify(res));
                    if (res.data.result) {
                        const accessToken = res.data.accessToken
                        localStorage.setItem('access_token', accessToken)
                        context.commit('retrieveToken', accessToken)
                        context.commit('setAccout', credentials.account)
                        context.commit('setHeader', true)
                        resolve(res)
                    } else {
                        alert(res.data.message);
                    }
                }).catch(err => {
                    alert('로그인 실패')
                    reject(err)
                })
            })
        },
        // 로그인 토큰 재인증
        certifyAccess(context, credential) {
            // console.log("======= STORE certifyAccess")
            return new Promise((resolve, reject) => {
                // console.log("======= STORE certifyAccess credential.accessToken :: ", credential.accessToken)
                axios.post('/api/auth/certifyAuth', {
                                                        accessToken: credential.accessToken 
                                                    }
                ).then(res => {
                    // console.log("======= STORE certifyAccess res :: " , JSON.stringify(res));
                    if (res.data.result) {
                        const accessToken = res.data.accessToken
                        localStorage.setItem('access_token', accessToken)
                        context.commit('setAccout', res.data.account)
                        context.commit('retrieveToken', accessToken)
                        context.commit('setHeader', true)
                        resolve(res)
                    } else {
                        alert(res.data.message)
                        localStorage.removeItem('access_token')
                        resolve(res)
                    }
                }).catch(err => {
                    alert('catch 로그인이 말료되었습니다.')
                    localStorage.removeItem('access_token')
                    reject(err)
                })
            })
        },
        // 로그아웃 (jwt token 삭제)
        destroyToken(context) {
            // console.log("======= STORE destroyToken")
            if (context.getters.loggedIn) {
                return new Promise((resolve, reject) => {
                    localStorage.removeItem('access_token')
                    context.commit('destroyToken')
                    resolve(res)
                }).catch(err => {
                    localStorage.removeItem('access_token')
                    context.commit('destroyToken')
                    reject(err)
                })
            }
        },
        // 보유 코인 조희
        getCurrencyBalance(context) {
                this.$http.post('/api/getCurrencyBalance', {
                                                            account: this.$store.getters.accountIn
                                                        }
                ).then((response) => {
                    var result = response.data
                    // console.log("======== STORE getCurrencyBalance :: ", result)
                    if (result.result) {
                        context.commit('setTokenAmt', result.tokenAmt)
                    }
                })
        },
                    
        // OSB 조회
        setTokenAmt(context, credential) {
            // console.log("======= STORE setTokenAmt tokenAmt :: ", credential.val)
            context.commit('setTokenAmt', credential.val)
        },
        // 데이터타입 조회
        getDataTypes(context) {
            // console.log("======== STORE getDataTypes")
            return new Promise((resolve, reject) => {
                axios.post('/api/getDataTypes').then(res => {
                    var result = res.data
                    // console.log("======== STORE getDataTypes", result)
                    context.commit('setDataTypes', result.menuList)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },



    }
})