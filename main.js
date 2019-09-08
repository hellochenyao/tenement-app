import Vue from 'vue'
import App from './App'
import mainStore from './store';

import loadingComponent from "./components/loading-component";

Vue.config.productionTip = true

Vue.component('loading-component',loadingComponent)

App.mpType = 'app'
import urlConfig from './utils/config_utils.js' 
import RestAPI from './utils/restApi/index.js';
import jwt from 'jsonwebtoken'
let dateDiff = "";
RestAPI.init((responseJson) => new Promise((resolve, reject) => {//简单的AOP扩展
        if (responseJson.code) {
			if (responseJson.code) {
				console.log(responseJson.code )
            let flag=false;
            if (responseJson.code == 'auth-token-time-out') {
                flag=true;
            }
            if (responseJson.code == 'missing-auth-token') {
                flag=true;
            }
            if (responseJson.code =='invalid-auth-token') {
                flag=true;
            }
            if(flag){
				uni.removeStorageSync('userId');
                uni.removeStorageSync('userJWTandToken');
                uni.redirectTo({
                	url:"/pages/login/index"
                }); 
            }
            reject(responseJson); 
			}
		}
        resolve(responseJson);
    }),
    (isValidateJwt,url) => new Promise(async (resolve, reject) => {
        if (!isValidateJwt) {
            resolve("")
        } else { 
            let userJWTandToken = uni.getStorageSync("userJWTandToken");
            let userJWT="",refreshToken="";
            if(userJWTandToken){
                 userJWT = userJWTandToken.split('/')[0];
                 refreshToken = userJWTandToken.split('/')[1];
            }else{
               
            }
            var decoded = jwt.decode(userJWT.substring(7), {complete: true});
			if(!decoded){
				uni.redirectTo({
					url:"/pages/login/index"
				});
				return;
			}
            if(dateDiff===""){
                dateDiff = await getCurrentTime();
            }
            let timestamp = (Number(Date.parse(new Date()))+dateDiff)/1000;
			console.log(decoded)
            if ((decoded.payload.exp-60 <= timestamp)) {
                let params = {
                    refreshToken,
                    jwt: userJWT.substring(7)
                }; 
                uni.request( {
					url:urlConfig.requestUrl+'/app/wx-user/auth/refreshToken',
                    method: 'post',
                    header: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    data: JSON.stringify(params || {}), 

                }).then(function (response) {
                    return response.json();
                }).then((res) => {
                    if (res.code) {
						uni.removeStorageSync('userJWTandToken');
                    } else if (res.jwt) {
                        uni.setStorageSync("userJWTandToken",res.jwt+'/'+res.refreshToken);
                        // sessionStorage.setItem("userJWT",res.jwt);
                        // sessionStorage.setItem("refreshToken",res.refreshToken);
                    }
                    resolve(res.jwt)
                })
            }else {
                resolve(userJWT)
            }
        } 
    }));

async function getCurrentTime() {  
     return new Promise((resolve,reject)=>{   
        RestAPI.request(`/manager/system/time`, {}, 'get', false)
            .then((timeData) => { 
				console.log(timeData)
                let timestamp = Date.parse(new Date());
                let timeDiff = timeData.time-timestamp;
                resolve(timeDiff)
            }).catch(error => {
				console.log(error)
        });
    });
} 
Vue.prototype.$store = mainStore;
const app = new Vue({
    ...App,
	mainStore
})
app.$mount()
