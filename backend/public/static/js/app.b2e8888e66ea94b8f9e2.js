webpackJsonp([12],{NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("7+uW"),o=(n("erWL"),{name:"App",data:function(){return{tokenAmt:"0",account:null,homeUrl:"/home",menuList:[]}},created:function(){var t=this;this.$store.dispatch("getDataTypes").then(function(e){t.menuList=e.data.menuList}).catch(function(t){alert("failed")})},computed:{headerFlg:function(){var t=this.$store.getters.headerFlg;return t&&(this.account=this.$store.getters.accountIn),t},loggedIn:function(){var t=this,e=this.$store.getters.loggedIn;return e&&this.$http.post("/api/getCurrencyBalance",{account:this.$store.getters.accountIn}).then(function(e){var n=e.data;n.result&&(t.tokenAmt=n.tokenAmt,t.$store.dispatch("setTokenAmt",{val:n.tokenAmt}))}).catch(function(t){alert("failed")}),e}}}),r={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page-wrap",attrs:{id:"app"}},[t.headerFlg?n("header",[n("h1",[n("router-link",{attrs:{to:{name:"Login"}}},[t._v("OASISBloc "),n("span",[t._v("Market")])])],1),t._v(" "),t.loggedIn?t._e():n("div",[n("router-link",{staticClass:"btn-log",attrs:{to:{name:"Login"}}},[t._v("Login")])],1),t._v(" "),t.loggedIn?n("div",[n("router-link",{staticClass:"btn-log",attrs:{to:{name:"Logout"}}},[t._v("Logout")])],1):t._e(),t._v(" "),t._m(0),t._v(" "),t.loggedIn?n("div",{staticClass:"user"},[n("span",{staticClass:"info"},[t._v("\n\t\t\t\t"+t._s(t.account)+" / "+t._s(t.tokenAmt)+"\n\t\t\t")]),t._v(" "),n("router-link",{staticClass:"btn middle bg-lightseagreen",attrs:{to:{name:"MypageData",params:{type:"traded"}}}},[t._v("My Page")])],1):t._e()]):t._e(),t._v(" "),t.headerFlg?n("div",{staticClass:"container"},[n("aside",[n("nav",[n("a",{staticClass:"btn-close",attrs:{href:"#n"}},[t._v("close")]),t._v(" "),n("router-link",{staticClass:"btn-cate bg-skyblue",attrs:{to:{name:"AddCategory"}}},[t._v("Add Category")]),t._v(" "),n("router-link",{staticClass:"btn-cate bg-blue",attrs:{to:{name:"AddData"}}},[t._v("AddData")]),t._v(" "),t._l(t.menuList,function(e){return n("ul",[n("li",[n("router-link",{attrs:{to:{name:"CateDataList",params:{cate:e}}}},[t._v(t._s(e))])],1)])})],2)]),t._v(" "),n("router-view")],1):t._e(),t._v(" "),t.headerFlg?t._e():n("div",{staticClass:"container"},[n("router-view")],1),t._v(" "),t.headerFlg?n("footer",[n("p",{staticClass:"foot-msg"},[t._v("Anything you want")]),t._v(" "),t._m(1)]):t._e()])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("a",{staticClass:"m-menu",attrs:{href:"#n"}},[e("span",[this._v("All Menu")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",{staticClass:"copyright"},[this._v("Copyright © 2019 "),e("a",{attrs:{href:"#"}},[this._v("Double Chain")]),this._v(". All rights reserved.")])}]},s=n("VU/8")(o,r,!1,null,null,null).exports,c=n("/ocq");a.a.use(c.a);var i=new c.a({mode:"history",routes:[{path:"/",name:"Login",component:function(){return n.e(1).then(n.bind(null,"xJsL"))}},{path:"/login",name:"Login",component:function(){return n.e(1).then(n.bind(null,"xJsL"))}},{path:"/logout",name:"Logout",component:function(){return n.e(6).then(n.bind(null,"0Kyw"))}},{path:"/authLogin",name:"AuthLogin",component:function(){return n.e(9).then(n.bind(null,"PwuJ"))}},{path:"/home",name:"Home",component:function(){return n.e(7).then(n.bind(null,"lO7g"))}},{path:"/addCategory",name:"AddCategory",component:function(){return n.e(10).then(n.bind(null,"vw9D"))}},{path:"/addData",name:"AddData",component:function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,"6X6/"))}},{path:"/cateDataList/:cate",name:"CateDataList",component:function(){return Promise.all([n.e(0),n.e(8)]).then(n.bind(null,"UWtB"))}},{path:"/mypageData/:type",name:"MypageData",component:function(){return Promise.all([n.e(0),n.e(5)]).then(n.bind(null,"Wb5n"))}},{path:"/mypageTransactions",name:"MypageTransactions",component:function(){return n.e(4).then(n.bind(null,"BzCP"))}},{path:"/test123",name:"TEST123",component:function(){return n.e(3).then(n.bind(null,"Jm11"))}}]}),u=n("mtWM"),l=n.n(u),m=n("//Fk"),d=n.n(m),h=n("NYxO");n("Ya8g"),n("UZ5h");a.a.use(h.a);var g=new h.a.Store({state:{accessToken:localStorage.getItem("access_token")||null,currentUser:{},headerFlg:!1,account:null,tokenAmt:"0",menuList:[],selcCate:""},getters:{headerFlg:function(t){return t.headerFlg},loggedIn:function(t){return null!==t.accessToken},accountIn:function(t){return t.account},getTokenAmt:function(t){return t.tokenAmt},getStoreMenuList:function(t){return t.menuList}},mutations:{setHeader:function(t,e){t.headerFlg=e},retrieveToken:function(t,e){t.accessToken=e},setAccout:function(t,e){t.account=e},destroyToken:function(t){t.accessToken=null},setTokenAmt:function(t,e){t.tokenAmt=e},setDataTypes:function(t,e){t.menuList=e}},actions:{setHeader:function(t,e){t.commit("setHeader",e.val)},retrieveToken:function(t,e){return new d.a(function(n,a){l.a.post("/api/auth/login",{account:e.account,password:e.password}).then(function(a){if(a.data.result){var o=a.data.accessToken;localStorage.setItem("access_token",o),t.commit("retrieveToken",o),t.commit("setAccout",e.account),t.commit("setHeader",!0),n(a)}else alert(a.data.message)}).catch(function(t){alert("로그인 실패"),a(t)})})},certifyAccess:function(t,e){return new d.a(function(n,a){l.a.post("/api/auth/certifyAuth",{accessToken:e.accessToken}).then(function(e){if(e.data.result){var a=e.data.accessToken;localStorage.setItem("access_token",a),t.commit("setAccout",e.data.account),t.commit("retrieveToken",a),t.commit("setHeader",!0),n(e)}else alert(e.data.message),localStorage.removeItem("access_token"),n(e)}).catch(function(t){alert("catch 로그인이 말료되었습니다."),localStorage.removeItem("access_token"),a(t)})})},destroyToken:function(t){if(t.getters.loggedIn)return new d.a(function(e,n){localStorage.removeItem("access_token"),t.commit("destroyToken"),e(res)}).catch(function(e){localStorage.removeItem("access_token"),t.commit("destroyToken"),reject(e)})},getCurrencyBalance:function(t){this.$http.post("/api/getCurrencyBalance",{account:this.$store.getters.accountIn}).then(function(e){var n=e.data;n.result&&t.commit("setTokenAmt",n.tokenAmt)})},setTokenAmt:function(t,e){t.commit("setTokenAmt",e.val)},getDataTypes:function(t){return new d.a(function(e,n){l.a.post("/api/getDataTypes").then(function(n){var a=n.data;t.commit("setDataTypes",a.menuList),e(n)}).catch(function(t){n(t)})})}}});a.a.config.productionTip=!1,a.a.prototype.$http=l.a;var p=localStorage.getItem("access_token");p?a.a.prototype.$http.defaults.headers.common.Authorization=p:i.push({name:"Login"}),new a.a({el:"#app",router:i,store:g,components:{App:s},template:"<App/>"})},erWL:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.b2e8888e66ea94b8f9e2.js.map