import Vue from "vue";
import Vuex from "vuex";
import RestApi from "../utils/restApi/index.js" 
import {loginStore} from "./loginStore";
import {invitateStore} from "./invitateStore";
import {privateMsgStore} from "./privateMsgStore"
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
		privateMsgStore
	}
});
export default mainStore; 