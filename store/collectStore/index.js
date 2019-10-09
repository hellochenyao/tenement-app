import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const collectStore = {
	state:{ 
    },
    mutations:{
	
    },
    getters:{
	
    }, 
    actions:{
		collect({commit,dispatch},payload){
			let {userId,invitationId} = payload;
			return RestApi.request(`/app/collect/invitation/${userId}/item/save/${invitationId}`,{},"POST");
		},
		queryCollect({commit,dispatch},payload){
			let {userId,invitationId} = payload;
			return RestApi.request(`/app/collect/invitation/${userId}/item/query/collect/status`,{invitationId},"GET");
		},
		getCollectInvitation({commit,dispatch},payload){
			let {userId,pageNo,pageSize} = payload;
			return RestApi.request(`/app/collect/invitation/${userId}/item/find/all`,{pageNo,pageSize},"GET");
		}
    }
}
export {collectStore};