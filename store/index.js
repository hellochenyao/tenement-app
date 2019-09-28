import Vue from "vue";
import Vuex from "vuex";
import RestApi from "../utils/restApi/index.js" 
import {loginStore} from "./loginStore";
import {invitateStore} from "./invitateStore";
import {privateMsgStore} from "./privateMsgStore"
import {userStore} from "./userStore/index.js"
import {concernStore} from "./concernStore/index.js"
import {userBrowsingStore} from "./userBrowsingStore"
Vue.use(Vuex); 
const mainStore = new Vuex.Store({
	state:{
		
	}, 
	mutations:{
		
	}, 
	actions:{
		
	}, 
	modules:{
		loginStore, 
		invitateStore,
		privateMsgStore,
		userStore,
		concernStore,
		userBrowsingStore
	}
});
export default mainStore; 