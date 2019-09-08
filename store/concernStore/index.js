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
			return RestApi.request(`/app/user/concern/${userid}/save/record/${type}/${toUserId}`,null,"POST");
		},
		findConcernState(action,payload){
			let {userid,toUserId} = payload;
			return RestApi.request(`/app/user/concern/${userid}/find/concern/state`,{toUserid:toUserId},"GET");
		},
		getConcernDetail(action,payload){
			let {userid,toUserId} = payload;
			return RestApi.request(`/app/user/concern/${userid}/find/nums`,{toUserid:toUserId},"GET");
		}
    }
}
export {concernStore};