<template>
	<view>
		<view class="bg-container" v-if="type"></view>
		<view class="container" :style="{height:type?'70%':0}">
			<view class="title-bar">
				<image src="../../../../static/images/page/关闭.png" class="close" @tap="showDetailHandler(false)"></image>
				<text class="title">1楼的回复</text>
			</view>
			<view class="msg-content" id="view">
				<res-msg :msg="res"></res-msg>
			</view>
			<scroll-view scroll-y="true" @scrolltolower="downReachBottom" class="res" :style="{height:height}">
				<view class="noDataContent" :style="{height:height}" v-if="res.resDetail.length==0">
				<image src="../../../../static/wenju-mescroll/mescroll-empty.png" class="no-data" mode='aspectFit'></image>
				<text class="noDataDetail">别让楼主寂寞太久哦</text>
				</view>
				<res-msg :key="index" :msg="item" v-for="(item,index) in msgArr"></res-msg>
				<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import ResMsg from "./resMsg"
	import {getNodeHeight,getSystem} from "../../../../utils/config.js"
	import getStorage from "../../../../utils/getStorage.js"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import {
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	export default {
		data() { 
			return {
				type:false,
				height:"0px",
				downMoreStatus:"more",
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多回复"
				},
				pageNo:1,
				pageSize:10,
				total:0,
				msgArr:[]
			}
		},
		props:{  
			res:{},
			detailType:Boolean,
			responseToUserMsgId:""
		},
		components: {
			ResMsg,
			uniLoadMore
		},
		computed:{ 
			...mapState({ 
				currentResponseUser:state=>state.invitateStore.currentResponseUser,
				userinfo:state=>state.loginStore.userinfo
			}),
		},
		async mounted() {
			let systeminfo =await getSystem();
			const query = uni.createSelectorQuery().in(this);
			query.select('#view').boundingClientRect(data => {
			  this.height = systeminfo.windowHeight*0.7 - data.height - uni.upx2px(90) - 1 +"px";
			}).exec();
			setTimeout(()=>{
				console.log(this.res)
			},3000)
		},
		onReachBottom(){
			this.downReachBottom()
			console.log("a")
		},
		methods: {
			showDetailHandler(type){
				this.type = type;
				this.resetState();
				this.$emit("changeType",type);
				this.$store.dispatch("responseUserAction",{})
			},
			resetState(){
				this.msgArr=[]
				this.pageNo=1;
				this.downMoreStatus="more";
			},
			changeMsgTotal(num){
				this.responseTotal = num;
			},
			downReachBottom(){
				let userId = getStorage('userId');
				let invitationId = this.res.inivitationid;
				let msgId = this.res.id;
				let pageNo = this.pageNo;
				let pageSize = this.pageSize;
				if(this.changeDownMoreStatus()){
					return;
				}
				this.getResponseMsg(userId,invitationId,msgId);
			},
			addResponseContent(userId,msgId){
				let responseToUserId=this.currentResponseUser.id;
				let responseToUserNickName=this.currentResponseUser.nickName;
				this.$store.dispatch("getResponseMsgContent",{userId,msgId})
				.then(res=>{
					console.log(this.res)
						let newResMsg = {
							answerUserId:responseToUserId,
							answerUserNickname:responseToUserNickName,
							avatar:this.userinfo.avatarUrl,
							createTime:res.createTime,
							gender:this.userinfo.gender,
							msg:res.msg,
							nickname:this.userinfo.nickName,
							userId:userId
						}
						if(this.msgArr.length>=this.total){
							this.msgArr.push(newResMsg)
						}
						let responseMsgTotal=0;
						if(this.downMoreStatus =="noMore"){
							responseMsgTotal = this.msgArr.length;
						}else{
							responseMsgTotal = this.total+1
						}
						this.$store.commit("setResponseMsg",{
							msg:newResMsg,
							total:responseMsgTotal,
							msgId:this.res.id
						})
					}) 
					.catch(e=>{
						console.log(e)
					})
			},
			getResponseMsg(userId,invitationId,pid){
				let {pageNo,pageSize} = this;
				this.downMoreStatus = "loading"
				this.$store.dispatch("getReponseToUserMsg",{
					userId,
					invitationId,
					pid,
					pageNo,
					pageSize
				})
				.then(res=>{
					console.log(res)
					if(res.data.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					this.msgArr =this.msgArr.concat(res.data);
					this.total = res.total
					this.changeDownMoreStatus()
				})
			},
			changeDownMoreStatus(){
				if(this.msgArr.length>=this.total){
					this.downMoreStatus = "noMore";
				}else{
					this.downMoreStatus = "more"
				}
				if(this.downMoreStatus=="noMore"){
					return true
				}
				return false
			}
		},
		watch:{
			detailType(value){
				this.type = value;
				if(value){
					let userId = getStorage('userId');
					this.getResponseMsg(userId,this.res.inivitationid,this.res.id);
				}
			},
			responseToUserMsgId(v){
				let msgId = parseInt(v);
				let userId = getStorage('userId');
				this.addResponseContent(userId,msgId)
			}
		}
	}
</script>

<style lang="scss">
	.bg-container{
		width:100%;
		height:100%;
		background: #000;
		opacity: 0.7;
		position: fixed;
		z-index: 100;
		left:0;
		top:0;
	}
	.container{
		width:100%;
		height:70%;
		box-sizing: border-box;
		position: fixed;
		z-index: 1000;
		transition: all 0.3s;
		left:0;
		bottom:80upx;
		background: #FFF;
		.title-bar{
			width:100%;
			height: 90upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #eaeaea;
			position: relative;
			.close{
				width:50upx;
				height: 50upx;
				position: absolute;
				left:10upx;
				top:20upx;
			}
			.title{
				font-size: 30upx;
				color:#000;
			}
		}
		.msg-content{
			width:100%;
			padding:10upx 10upx 0upx 10upx;
			box-sizing: border-box;
			border-bottom: 16upx solid #eaeaea;
		}
		.res{
			width:100%;
			height: calc(100% - 90upx);
			padding:10upx;
			box-sizing: border-box;
			overflow-y: auto;
			.noDataContent{
				width:100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.no-data{
					width:50%;
					height:130px;
				}
				.noDataDetail{
					font-size:23upx;
					color:#CCC;
					margin-top: 30upx;
				}
			}
		}
	}
</style>
