import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const concernStore = {
	state:{ 
    },
    mutations:{
	
    },
    getters:{
	
    }, 
    actions:{
		concernActions({commit,dispatch},payload){
			let {userid,toUserId,type} = payload;
			let post = {
				userId:userid,
				toUserid:toUserId
			}
			return RestApi.request(`/app/user/concern/{userId}/save/record/{type}`,post,"POST");
		}
    }
}
export {concernStore};