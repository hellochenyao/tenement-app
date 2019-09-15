<template>
	<view class="contain" :style="{borderTop:vid?'':'1px solid #eaeaea'}">
		<res-msg :msg="dat" @setCurrentSelect="setCurrentSelect"></res-msg>

		<view v-if="dat.resDetail.length!=0" class="response-msg-content" @tap="setCurrentSelect(dat)">
			<view class="res-msg" :key="index" v-for="(resMsg,index) in dat.resDetail">
				<text class="user">{{resMsg.nickname}}：</text>
				<text class="response-text">回复</text>
				<text class="user">{{resMsg.answerUserNickname}}：</text>
				<text class="content">{{resMsg.msg}}</text>
			</view>  
			<view class="more-response" v-if="dat.resTotal>2">
				<text>查看{{dat.resTotal}}条回复</text>
				<image src="../../../../static/images/home_page/right.png" class="getDetail"></image>
			</view>
		</view>
	</view>
</template>

<script> 
	import ResMsg from "./resMsg";
	import {
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	export default { 
		data() { 
			return {
				res:'',
				hideButton:false,
				msgRes:{}
			}
		},
		props:{ 
			dat:{},
			vid:Boolean,
			responseTo:Function,
			writeIndex:Number
		},
		mounted() {
			
		}, 
		computed:{
			...mapState({
			    responseMsg:state=>{
					return state.invitateStore.responseMsg
				}
			}),
		},
		components: {
			ResMsg
		},
		methods: {
			setCurrentSelect(data){
				this.$emit("setCurrentSelectMsg",data);
				this.$store.dispatch("responseUserAction",{
					id:data.userId,
					nickName:data.nickname,
					invitationId:data.id
				});
			}
		},
		watch:{
		}
	}
</script>

<style lang="scss">
	.contain{
	}
	.response-msg-content{
		width:calc(100% - 90upx);
		margin-left: 90upx;
		min-height: 100upx; 
		margin-bottom: 70upx;
		background: rgb(240,240,240);
		opacity: 0.7;
		padding:10upx;
		box-sizing: border-box;
		.res-msg{
			width:100%;
			word-break: break-all;
			font-size: 29upx;
			color:#000;
			margin:10upx 0;
			.user{
				width:30%;
				height: 20px;
				font-size: 29upx;
				color:#1796f9;
			}
			.content{
				color:#000!important;
			}
			.response-text{
				margin-right: 1upx;
			}
		}
		.more-response{ 
			width:100%;
		    display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			font-size: 27upx;
			.getDetail{
				width:30upx;
				height:30upx;
			}
		}
	}
</style>
