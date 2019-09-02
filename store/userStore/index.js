import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const userStore = {
	state:{ 
    },
    mutations:{
	
    },
    getters:{
	
    }, 
    actions:{
		requestUserInfo({commit,dispatch},payload){
			let {userId} = payload;
			return RestApi.request(`/app/user/${userId}/info`,null,"GET") 
		}
    }
}
export {userStore};