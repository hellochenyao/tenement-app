<template>
	<view>
	<view class="user-info">
		<image class="avatar" :src="list.avatar"></image>
		<view class="user-data">
			<view class="user-content">
				<text class="nick-name">{{list.nickname}}</text>
				<image class="sex-icon" :src="list.gender==0?'../../../../static/images/home_page/boy.png':'../../../../static/images/home_page/girl.png'"></image>
			</view>
			<view class="come-data">
				<text class="come-text">{{list.createTime?calLoginDate(list.createTime):""}}</text>
			</view>
		</view> 
		<text class="response-btn"  v-if="loginUserId!=list.userId" @tap="setCurrentSelect({id:list.userId,nickName:list.nickname,invitationId:list.id})">回复</text>  
	</view> 
	<view class="write-content">
		<text class="response-text" v-if="showType">回复</text>
		<text class="user" v-if="showType">{{list.answerUserNickname}}：</text>
		<text class="wirte-content-text">{{list.msg}}</text> 
	</view>
	</view>
</template>

<script> 
	import {calloginDate} from "../../../../utils/calDateDiff.js"
		import getStorage from "../../../../utils/getStorage.js"
		import {
		    mapState,  
		    mapMutations, 
			mapActions
		} from 'vuex';
	export default { 
		data() { 
			return {
				list:this.msg,
				msgType:false
			}
		},
		props:{ 
			msg:{},
			type:Boolean
		}, 
		mounted() {
			
		},
		computed:{
			...mapState({
				currentResponseUser:state=>{
					return state.invitateStore.currentResponseUser
				},
				msgDetailNickName:state=>{
					return state.invitateStore.msgDetailNickName
				}
			}),
			loginUserId(){
				return  getStorage('userId');
			},
			showType(){
				let msgDetailNickName = this.$store.state.invitateStore.msgDetailNickName
				return this.list.answerUserNickname&&(msgDetailNickName!=this.list.answerUserNickname)
			}
		}, 
		methods: {
			calLoginDate(dateLogin,now){
				if(dateLogin){
					dateLogin = dateLogin.toString().replace(/-/g, '/')
				}
				return calloginDate(new Date(dateLogin),new Date());
	
			},
			setCurrentSelect(user){
				this.$emit("setCurrentSelect",this.list);
				this.$store.dispatch("responseUserAction",user)
			}
			
		},
		watch:{
			msg(value){ 
				this.list = value;
			}
		}
	}
</script>

<style lang="scss">
	.user-info{
		width:100%;
		height: 60upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		margin-top: 30upx;
		background: #FFF;
		position: relative;
		.avatar{ 
			width:70upx;
			height:70upx;
			border-radius: 100px;
		}
		.user-data{
			width:calc(100% - 70upx);
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.user-content{
				display: flex;
				flex-direction: row;
				align-items: center;
				.nick-name{
					font-size: 26upx;
					color:$uni-app-font-color;
				}
				.sex-icon{
					width:35upx;
					height: 35upx;
				}
			}
			.come-data{
				.come-text{
					font-size: 26upx;
					color:#999;
					margin-right: 10upx;
				}
			}
		}
		.response-btn{
			height:60upx;
			font-size: 27upx;
			position: absolute;
			right:0;
			top:10upx;
			color:$uni-app-basic-color;
		}
	}
	.write-content{
		width:calc(100% - 90upx);
		margin-left: 90upx;
		min-height: 100upx;
		padding: 20upx 0;
		word-break: break-all;
		.user{
			width:30%;
			height: 20px;
			font-size: 29upx;
			color:#1796f9;
		}
		.response-text{
			font-size: 29upx;
			margin-right: 1upx;
		}
		.wirte-content-text{
			font-size:33upx;
			color:#000;
		}
	}
</style>
