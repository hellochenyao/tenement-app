import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const adviceStore = {
	state:{ 
    },
    mutations:{
	 
    },
    getters:{
	 
    },  
    actions:{ 
		sendAdvice({commit,dispatch},payload){
			let {userId} = payload;
			return RestApi.request(`/app/tip-offs/${userId}/tip`,payload,"POST");
		}
    }
}
export {adviceStore};