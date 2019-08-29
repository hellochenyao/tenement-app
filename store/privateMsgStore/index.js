import RestApi from "../../utils/restApi";
import info from "../../utils/info";
import configUrl from "../../utils/config_utils";
const privateMsgStore = {
	state:{ //存放组件之间共享的数据
	   socketOpen:false,
	   msgQueue:[],
	   refreshMsgList:false
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
	   }
    }, 
    getters:{
	
    },
    actions:{
		connectWebSocketMsg({commit,dispatch},payload){
			let {userId,msgQueue} = payload
			let url = configUrl.wbUrl
			let _this = this;
			uni.connectSocket({
				url: `ws://${url}/im/${userId}`,
			});
			let msgArr = msgQueue;
			uni.onSocketOpen(function (res) {
			  commit("setSocketOpen",true);
			  for (var i = 0; i < msgArr.length; i++) {
				  let post={msg:msgArr[i]};
				dispatch("sendSocketMsg",post)
			  }
			});
			uni.onSocketMessage(function (res) {
			  console.log('收到服务器内容：' + res.data);
			  let response = JSON.parse(res.data);
			  if(response.code&&(response.code=="success"||response.code=="newMsg")){
				  console.log("a")
				  commit("setRefreshMsgList",new Boolean(true));
			  }
			});
		},
		
		sendSocketMsg({commit,dispatch},payload){
			let {msg} = payload;
			uni.sendSocketMessage({
				 data: JSON.stringify(msg)
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
			console.log(pageNo)
			let postData = {
				receiveUserid,
				pageNo,
				pageSize
			}
			return RestApi.request(`/app/tenement/${userId}/find/msg`,postData,'get')
		}
    }
}
export {privateMsgStore};