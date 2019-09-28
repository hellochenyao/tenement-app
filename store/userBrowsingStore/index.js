import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const userBrowsingStore = {
	state:{ //存放组件之间共享的数据
   
    },
    mutations:{//显式的更改state里的数据
	  
    },
    getters:{ 
    },
    actions:{
		getBrowsingInvitation({commit,dispatch},payload){
			return RestApi.request(`/app/tenement/${payload.userId}/query/browsing/records`,
			payload,
			"GET") 
		}
	}
}
export {userBrowsingStore};