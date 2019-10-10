import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const wordStore = {
	state:{ 
    },
    mutations:{
	
    },
    getters:{
	
    }, 
    actions:{
		requestWord({commit,dispatch},payload){
			let {userId,pageNo,pageSize} = payload;
			return RestApi.request(`/app/tenement/${userId}/query/new/word`,{pageNo,pageSize},"GET") 
		}
    }
}
export {wordStore};