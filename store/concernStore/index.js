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
			let {userid,toUserId,type,concernType} = payload;
			console.log(concernType)
			return RestApi.request(`/app/user/concern/${userid}/save/record/${type}/${toUserId}?concernType=${concernType}`,null,"POST");
		},
		findConcernState(action,payload){
			let {userId,toUserId,concernType} = payload;
			return RestApi.request(`/app/user/concern/${userId}/find/concern/state?concernType=${concernType}`,{toUserid:toUserId},"GET");
		},
		getConcernDetail(action,payload){
			let {userid,toUserId,concernType} = payload;
			return RestApi.request(`/app/user/concern/${userid}/find/nums?concernType=${concernType}`,{toUserid:toUserId},"GET");
		}
    }
}
export {concernStore};