import RestApi from "../../utils/restApi";
import info from "../../utils/info";
import configUrl from "../../utils/config_utils";

import {connectSocketInterval} from "../../utils/config.js";
import getStorage from "../../utils/getStorage.js";
const privateMsgStore = {
	state:{ //存放组件之间共享的数据
	   socketOpen:false,
	   msgQueue:[],
	   refreshMsgList:{},
	   errorSendMsg:[]
    },
    mutations:{//显式的更改state里的数据
	   setSocketOpen(state,res){
		   state.socketOpen = res;
	   },
	   setMsgQueue(state,res){
		   if(res){
			 state.msgQueue.push(res)  
		   }else{
			   state.msgQueue=[]
		   }
	   },
	   setRefreshMsgList(state,res){
		   console.log(res)
		   state.refreshMsgList = res;
	   },
	   setErrorSendMsg(state,res){
		   let {id,type} = res;
		   if(type==0){
			   let index = state.errorSendMsg.indexOf(parseInt(id));
			   if(index!==-1){
				  state.errorSendMsg.splice(index,1);
			   }
		   }else{
			   if(state.errorSendMsg.length==0){
				   state.errorSendMsg=[id];
				   return;
			   }
			   state.errorSendMsg.push(id);
		   }
	   }
    }, 
    getters:{
	
    },
    actions:{
		connectWebSocketMsg({commit,dispatch},payload){
			let {userId,data} = payload
			let url = configUrl.wbUrl
			let _this = this;
			let times=0;
			let connectSuccess=false;
			uni.connectSocket({
				url: `ws://${url}/im/${userId}`,
				success(){
					connectSuccess=true;
				}
			});
			uni.onSocketOpen(function (res) {
				commit("setSocketOpen",true);
				if(data){
					dispatch("sendSocketMsg",{msg:data.msg});
				}
			});
			uni.onSocketMessage(function (res) {
				console.log(res)
			  let response = JSON.parse(res.data);
			  if(!response.code&&!response.newMsg){
				  return;
			  }
			  if(response.newMsg){
				  let id = response.toUserId;
				  if(id!= userId){
				  	console.log('振动');
				  	uni.vibrateLong();
				  }
				  commit("setRefreshMsgList",response.newMsg);
			  }
			  if(response.code=="error"){
				  let id = response.id;
				  commit("setErrorSendMsg",{id,type:1});
			  }
			  if(response.code=="success"){
				  let id = response.id;
				  commit("setErrorSendMsg",{id,type:0});
			  }
			});
			uni.onSocketClose(function (res) {
			  connectSocketInterval();
			});
		},
		
		sendSocketMsg({commit,dispatch},payload){
			let msg = payload.msg;
			let data = {
				"content": msg.contentText,
				 "descText": msg.desc,
				 "msgId": msg.id,
				 "receiveUserid": parseInt(msg.toUserId),
				 "type": msg.type
			}
			let userId=getStorage("userId");
			return new Promise((rev,rec)=>{
				RestApi.request(`/app/tenement/${userId}/private/send/message`,data,'POST')
				.then(res=>{
					rev(res);
				})
				.catch(e=>{
					let {id} = msg;
					commit("setErrorSendMsg",{id,type:1});
					rec(e);
				})
			})
		},
		storeMsgQueue({commit,dispatch},payload){
			if(payload){
				let {msgQueue} = payload;
				commit("setMsgQueue",msgQueue);
			}else{
				commit("setMsgQueue","");
			}
		},
		findConnectingUsers({commit,dispatch},payload){
			let {userId,pageNo,pageSize} = payload;
			let post = {
				pageNo,
				pageSize
			}
			return RestApi.request(`/app/tenement/${userId}/find/user/receive/last/msg`,post,'get')
		},
		findHistoryMsg({commit,dispatch},payload){
			let {userId,receiveUserid,pageNo,pageSize} = payload;
			let postData = {
				receiveUserid,
				pageNo,
				pageSize
			}
			return RestApi.request(`/app/tenement/${userId}/find/msg`,postData,'get')
		},
		deleteMsg({commit,dispatch},payload){
			let {userId,receiveUserid} = payload;
			return RestApi.request(`/app/tenement/${userId}/private/message/delete/${receiveUserid}`,null,'DELETE')
		},
		read({commit,dispatch},payload){
			let {userId,receiverUserId} = payload;
			return RestApi.request(`/app/tenement/${userId}/preivate/message/read?receiveUserId=${receiverUserId}`,{},'PUT')
		}
    }
}
export {privateMsgStore};