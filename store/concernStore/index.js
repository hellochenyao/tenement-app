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
		},
		getFans(action,payload){
			let {userid,concernType,type,pageNo,pageSize} = payload;
			return RestApi.request(`/app/user/concern/${userid}/find/concern/list/${type}`,{concernType,pageNo,pageSize},"GET");
		},
		getUser(action,payload){
			let {content,userId,pageNo,pageSize} = payload
			return RestApi.request(`/app/user/${userId}/friend`,{content,pageNo,pageSize},"GET");
		}
		
    }
}
export {concernStore};