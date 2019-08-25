import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const loginStore = {
	state:{ //存放组件之间共享的数据
      loginRes:{
		  
	  },
	  userinfo:{}
    },
    mutations:{//显式的更改state里的数据
	    loginMutations(state,res){
			state.userinfo = res.userInfo;
		}
    },
    getters:{
	
    },
    actions:{
		//小程序
		loginAction({commit,dispatch}){
			try {
				const value = uni.getStorageSync('userId');
				if (!value) {
					uni.getUserInfo({
					  provider: 'weixin',
					  success: function (infoRes) { 
						console.log("getInfo",infoRes); 
						commit("loginMutations",infoRes);
						dispatch("getInfo",infoRes); 
					  },
					  fail:function(infoRes){ 
						  info.toast("加载用户信息失败！");
						  console.log("getInfo",infoRes)
					  }
					});
				}
			} catch (e) {
				// error
				commit("loginMutations",{});
			}
		},
		storeUserInfo({commit,dispatch},info){
			console.log(info)
			RestApi.request(`/app/user/${info.userId}/wx/info`,{encryptedData:info.infoRes.encryptedData,iv:info.infoRes.iv},"PUT",true) 
			.then(res=>{   
				console.log(res)
			})
			.catch(err=>{
				console.log(err)
			});
		},
		//小程序获取用户信息
		getInfo({commit,dispatch},info){ 
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
				  RestApi.request(`/app/wx-user/auth/login`,{jscode:loginRes.code},"POST",false) 
				  .then(res=>{   
					  console.log("aaa",res)
					  uni.setStorageSync("userId",res.userId);
					  uni.setStorageSync("userJWTandToken",res.jwt+'/'+res.refreshToken);
					  dispatch("storeUserInfo",{infoRes:info,userId:res.userId});
					  uni.switchTab({
					  	url:"../../pages/home_page/index" 
					  })
				  })
				  .catch(err=>{
				  	    console.log(err)
				  });
			  }
			});
		},
		//更新用户最后使用时间
		updateLastLogin({commit,dispath},payload){
			return RestApi.request(`/app/user/${payload.userId}/wx/last/login`,null,"PUT",true);
		}
    }
}
export {loginStore};