import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const circleStore = {
	state:{ 
    },
    mutations:{
	 
    },
    getters:{
	 
    },  
    actions:{ 
		getDynamic({commit,dispatch},payload){
			let {userId,type,pageNo,pageSize} = payload;
			return RestApi.request(`/app/user/dynamic/${userId}/query/dynamic`,{type,pageNo,pageSize},"GET");
		},
		likeDynamic({commit,dispatch},payload){
			let {userId,dynamicId} = payload
			return RestApi.request(`/app/like/${userId}/dynamic/create/${dynamicId}`,{},"POST");
		},
		getLikeDetail({commit,dispatch},payload){
			let {userId,dynamicId} = payload
			return RestApi.request(`/app/like/${userId}/dynamic/query/${dynamicId}`,{},"GET");
		},
		getState({commit,dispatch},payload){
			let {userId,dynamicId} = payload
			return RestApi.request(`/app/like/${userId}/dynamic/${dynamicId}/state`,{},"GET");
		},
		getComent({commit,dispatch},payload){
			let {userId,dynamicId,pageNo,pageSize} = payload
			return RestApi.request(`/app/user/comment/${userId}/query/comment`,{dynamicId,pageNo,pageSize},"GET");
		},
		sendComent({commit,dispatch},payload){
			let {userId,dynamicId,messagedId,content} = payload
			return RestApi.request(`/app/user/comment/${userId}/create/comment`,{dynamicId,messagedId,content},"POST");
		},
		getDynamicDetail({commit,dispatch},payload){
			let {userId,dynamicId,type} = payload
			return RestApi.request(`/app/user/dynamic/${userId}/query/dynamic`,{dynamicId,type},"GET");
		}
    }
}
export {circleStore};