import RestApi from "../../utils/restApi";
import info from "../../utils/info";
const invitateStore = {
	state:{ //存放组件之间共享的数据
	  publishSuccess:false,
	  invitationList:{},
	  msgRes:{},
	  currentResponseUser:{},
	  loading:false
    },
    mutations:{//显式的更改state里的数据
	    publishMutions(state,res){
			state.publishSuccess = res;
		},
		findInvitationMutions(state,res){
			state.invitationList = res;
		},
		responsetToUser(state,res){
			state.currentResponseUser = res;
		},
		setLoading(state,res){
			state.loading = res;
		}
    },
    getters:{
	
    },
    actions:{
		publishInvitation({commit,dispatch},payload){
			commit("publishMutions",false);
			RestApi.request(`/app/operation/${payload.id}/item/${payload.type}/publish`,payload,'POST',)
			.then(res=>{
				commit("publishMutions",true);
				info.toast("发布成功！");
			})
			.catch(err=>{
				console.log(err)
				info.toast("发布失败"+err.msg);
			});
		},
		findInvitation({commit,dispath},payload){
			RestApi.request(`/app/tenement/${payload.id}/invitations`,payload,'get')
			.then(res=>{
				commit("findInvitationMutions",res);
			})
			.catch(err=>{
				commit("findInvitationMutions",err);
			});
		},
		agreeStepAction({commit,dispatch},payload){
			return RestApi.request(`/app/tenement/${payload.likeUserId}/like/give/invitation`,payload,'post');
		},
		findMsg({commit,dispath},payload){
			return RestApi.request(`/app/tenement/${payload.id}/leave/words-items`,payload,'get')
		},
		responseUserAction(action,payload){
			action.commit("responsetToUser",payload);
		},
		responseMsg({commit,dispatch},payload){
			return RestApi.request(`/app/tenement/${payload.userId}/leave/words/${payload.invitationId}`,{answerMsgId:payload.answerMsgId,msg:payload.msg,invitationId:payload.invitationId,responseUserId:payload.responseUserId},'POST')
		},
		addViewTimes({commit,dispatch},payload){
			let {userId,invitationId} = payload
			return RestApi.request(`/app/tenement/${userId}/detail/${invitationId}`,null,'PUT')
		}, 
		getInvitationDetail({commit,dispatch},payload){
			let {userId,id} = payload;
			return RestApi.request(`/app/tenement/${userId}/find/invitation/${id}`,null,'get')
		}
    }
}
export {invitateStore};