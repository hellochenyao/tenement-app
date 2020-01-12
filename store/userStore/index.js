import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const userStore = {
	state:{ 
		userInfo:{}
    },
    mutations:{
		setUserInfo(state,info){
			state.userInfo = info;
		}
    },
    getters:{
	
    }, 
    actions:{
		requestUserInfo({commit,dispatch},payload){
			let {userId} = payload;
			RestApi.request(`/app/user/${userId}/info`,null,"GET")
			.then(res=>{
				commit("setUserInfo",res);
			})
			.catch(e=>{
				console.log(e)
			})
		}
    }
}
export {userStore};