<template>
	<view class="contant-container">
		<view class="user-info">
			<image class="avatar" :src="detail.avatar?detail.avatar:''"></image>
			<view class="user-data">
				<view class="user-content">
					<text class="nick-name">{{detail.publisher?detail.publisher:""}}</text>
					<image class="sex-icon" :src="detail.gender==0?'../../../static/images/home_page/boy.png':'../../../static/images/home_page/girl.png'"></image>
				</view>
				<view class="come-data">
					<text class="come-text">{{detail.lastLoginTime?calLoginDate(detail.lastLoginTime):""}}</text>
					<text class="come-text">浏览{{detail.viewTimes?detail.viewTimes:0}}次</text>
				</view>
			</view>
<!-- 			<image class="turn-icon" src="../../../static/images/home_page/turn1.png"></image> -->
		</view> 
		<view class="imgVideoContent" v-if="detail.type==1" :style="{border:!haveLoadImg?'1px solid #eaeaea':0}" @tap="viewImg"> 
			<image v-if="getFirstUrl.currentResource=='img'" :src="getFirstUrl.url" :style="{opacity:haveLoadImg?1:0}" @load="load" class="img" mode="scaleToFill" lazy-load="true"></image>
			<image v-if="!haveLoadImg" :src="image+timg.gif" class="loading"></image>
			<image v-if="haveLoadImg||getFirstUrl.currentResource=='video'" :src="getFirstUrl.currentResource=='video'?'../../../static/images/home_page/video.png':'../../../static/images/home_page/img.png'" class="icon"></image>
<!-- 			<video src="" class="video"></video> -->
            <video v-if="getFirstUrl.currentResource=='video'"
			       objectFit="fill" :src="getFirstUrl.url" 
				   class="video" 
				   :show-fullscreen-btn="false"
				   :show-play-btn="false"
				   :show-center-play-btn="false"
				   :controls="false"
		    />
			<view class="gothrough_detail">
				<view class="goView">
				    <view class="go"/>
				    <view class="gothrough_text"><image src="../../../static/images/home_page/go.png" class="goPicture"/><Text>查看</Text></view>
				</view>
			</view>
		</view>
		<view class="invitation-title">
			<text class="title">{{detail.title?detail.title:""}}<text class="location">/{{location}}</text></text>
		</view>
		<view class="invitation-condition">
			<view class="condition">
				<view class="budget">
					<image class="img" src="../../../static/images/home_page/budget.png" mode="widthFix"></image>
					<text class="condition-name">租金</text>
					<text class="condition-value">￥{{detail.rental?detail.rental:0}}元/月</text>
				</view>
				<view class="budget" v-if="detail.enterNums"> 
					<image class="img" src="../../../static/images/publish/enter.png" mode="widthFix"></image>
					<text class="condition-name">入住人数</text>
					<text class="condition-value">{{detail.enterNums?detail.enterNums:''}}</text>
				</view>
				<view class="budget" v-if="detail.roomRentType!=null&&detail.roomRentType!='undefined'">
					<image class="img" src="../../../static/images/publish/type.png" mode="widthFix"></image>
					<text class="condition-name">出租类型</text>
					<text class="condition-value">{{(detail.roomRentType!='undefined'&&detail.roomRentType==0?'整租':detail.roomRentType==1?'短租':detail.roomRentType==2?'合租':'')}}</text>
				</view>
				<view class="publish">
					<image class="img" src="../../../static/images/home_page/publish.png" mode="widthFix"></image> 
					<text class="condition-name">发布于{{formatPublishDate}}</text>
				</view>
				<view class="publish" v-if="detail.acceptedMedium!=null&&detail.acceptedMedium!='undefined'&&detail.acceptedMedium==0">
					<image class="img" src="../../../static/images/home_page/zhongjie.png" mode="widthFix"></image>
					<text class="condition-name">中介勿扰</text>
				</view> 
				<view class="location">
					<image class="img" src="../../../static/images/home_page/locationContent.png" mode="widthFix"></image>
					<text class="condition-name">{{currentLoc.detail}}</text>
				</view>
				<view class="per" v-if="detail.showPersonalInfo==0&&user.school&&user.occupation">
					<image class="img" src="../../../static/images/home_page/per.png" mode="widthFix"></image>
					<view class="condition">
						<view class="conditionTab">
							<text class="condition-name">学校</text>
							<text class="condition-value">{{user.school}}</text>
						</view>
						<view class="conditionTab">
							<text class="condition-name">职业</text>
							<text class="condition-value">{{user.occupation}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="location-map"> 
				<map class="map" :latitude="currentLoc.latitude" :longitude="currentLoc.longitude" :scale="18" :markers="covers" @tap="clickMap" :circles="circles">
                </map>
			</view>
		</view>
		<view class="invitation-desc">
			<view class="desc">
				<text class="desc-text">具体要求</text>
			</view>
			<text class="desc-content">{{detail.content?detail.content:''}}</text>
		</view>
		<view class="write-msg">
			<view class="desc">
				<text class="desc-text">留言（{{downMoreStatus=='noMore'?msgRes.length:total}}）</text>
			</view>
			<view v-if="false" class="haveno-msg">
				<image src="../../../static/wenju-mescroll/mescroll-empty.png"/>
			</view>
			<write-msg v-for="(item,idx) in msgRes" :writeIndex="idx" :key="idx" :vid="idx===0?true:false" @setCurrentSelectMsg="setCurrentSelectMsg" :dat="item"></write-msg>
			<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
		</view>
		<view class="invitation-bottom-tab">
			<view v-if="!currentResponseUser.nickName" class="tab-content">
				<image class="tab-img" src="../../../static/images/home_page/turn.png"/>
				<text class="tab-text">转发</text>
				<button open-type="share" class="return"></button>
			</view>
			<view v-if="!currentResponseUser.nickName" class="tab-content" @tap="openPost(true)">
				<image class="tab-img" src="../../../static/images/home_page/return.png"/>
				<text class="tab-text">海报</text>
			</view>
			<view v-if="!currentResponseUser.nickName" @tap="collect()" class="tab-content">
				<image class="tab-img" :src="haveCollect?'../../../static/images/home_page/yishouchang.png':'../../../static/images/home_page/shouchang.png'"/>
				<text class="tab-text" :style="{color:haveCollect?'#59c298':'#000'}">收藏</text>
			</view>
			<view v-if="!currentResponseUser.nickName&&detail.allowCallMe==1" class="tab-content phone" @tap="call()">
				<image class="tab-img" src="../../../static/images/home_page/phone.png"/>
				<text class="tab-text">联系TA</text>
			</view>
			<input v-if="currentResponseUser.nickName" class="response-input" :placeholder="'回复:'+(currentResponseUser.nickName?currentResponseUser.nickName:'')" v-model="res" />
			<button class="return" @tap="resClick(detail.userId,detail.publisher)">{{!currentResponseUser.nickName?'回复ta':'发送'}}</button>
		</view>
		<msg-detail :responseToUserMsgId="responseToUserMsgId" :currentMsgInfo="currentMsgInfo" :res="selectMsg" :detailType="detailType" @changeType="changeDetailTypeValue"></msg-detail>
		<loading-component :show="Object.keys(detail).length==0"></loading-component>
		<poster v-if="posterShow" 
		        @openPost="openPost"
				:location="detail.location"  
				:gender="detail.gender" 
				:title="detail.title" 
				:content="detail.content" 
				:avatar="detail.avatar"
				:remark="detail.remark"
		></poster>
	    </view>
	</view>
</template> 

<script>
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import writeMsg from './write_msg/index';
	import getStorage from "../../../utils/getStorage.js"
	import MsgDetail from "./write_msg/msgDetail";
	import {calloginDate} from "../../../utils/calDateDiff.js"
	import {qqmapsdk} from "../../../utils/QQMapWXConfig.js"
	import configUrl from "../../../utils/config_utils.js"
	import info from "../../../utils/info.js"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import poster from '../../../components/uni-poster/index.vue';
	import {appHeadUrl} from "../../../utils/config.js";
	export default {
		data() { 
			return { 
				res:'',
				hideButton:false,
				invitationId:"",
				msgRes:[],
				selectMsg:{},
				detailType:false,
		        detail:{},
				currentLoc: {
				    detail: "",
				    latitude: "",
				    longitude: "",
				},
				imgUrl:configUrl.uploadFileUrl,
				haveLoadImg:false,
				downMoreStatus:"more", 
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多回复"
				},
				pageNo:1,
				pageSize:10,
				total:0,
				responseToUserMsgId:"",
				posterShow:false,
				haveCollect:false,
				currentMsgInfo:{},
				image:configUrl.imagesUrl
			}
		},
		components: {
			writeMsg,
			MsgDetail,
			uniLoadMore,
			poster
		},
		onLoad(event) {
			
			this.invitationId = event.id;
			let userId = getStorage('userId');
			this.getWriteMsg(event.id,this.pageNo,this.pageSize);
			this.getInvitation(userId,event.id)
			this.viewAction(userId,event.id)
			this.queryCollect()
			this.$store.dispatch("getUserInfo") 
			this.$store.dispatch("getCodeAndBackImg",{
				path:"/pages/home_page/content/index?id="+this.invitationId,
				userId
			});
			if(event.msgId){
				console.log(this.msgRes)
				this.currentMsgInfo = Object.assign({},{
					msgId:event.msgId,
					invitationId:this.invitationId,
				})
				this.detailType = true;
			}
			this.getInfo()
		},
		onUnload(){
			this.$store.commit("setLoading",false)
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
			console.log(appHeadUrl)
		    return {
		      title: this.detail.title,
			  imageUrl:appHeadUrl,
		      path: "/pages/home_page/content/index?id="+this.invitationId,
		    }
		},
		onReachBottom(){
			this.downReachBottom()
		},
		computed:{
			...mapState({ 
				currentResponseUser:state=>state.invitateStore.currentResponseUser,
				userinfo:state=>state.loginStore.userinfo,
				user:state=>{
					return state.userStore.userInfo
				},
			    responseMsg:state=>{
					return state.invitateStore.responseMsg
				}
			}),
			location(){
				if(this.detail.location){
					return this.detail.location.split(",")[1]
				}
				return ""
			},
			formatPublishDate(){ 
				if(this.detail.createTime){
					let date = this.detail.createTime.replace(/-/g, '/')
					return new Date(date).getMonth()+1+"月"+new Date(date).getDate()+"日"
				}
				return ""
			},
			getFirstUrl(){
				if(this.detail.housingVideos){
					let path = this.detail.housingVideos.replace(/\\/g,"/")
					return {
						url:this.imgUrl+path,
				        currentResource:"video"					
					}
				}
				if(this.detail.housingImgs){
					let path = this.detail.housingImgs.split(",")[0].replace(/\\/g,"/");
					return {
						url:this.imgUrl+path,
						currentResource:"img"
					}
				}
			},
			getImgVideoUrl(){
				let imgVideoUrl = {video:"",image:""};
				if(this.detail.housingVideos){
					let path = this.detail.housingVideos.replace(/\\/g,"/")
					imgVideoUrl["video"] = this.imgUrl+path
				}
				if(this.detail.housingImgs){
					let len = this.detail.housingImgs.split(',').length
					if(len>0){
						let img = this.detail.housingImgs.split(',').map(v=>{
							let path = v.replace(/\\/g,"/");
							return this.imgUrl+path;
						});
						imgVideoUrl["image"] = img;
					}
				};return imgVideoUrl
			}
		}, 
		methods: {
			load(e){
				this.haveLoadImg = true;
			},
			downReachBottom(){
				let invitationId = this.invitationId;
				let pageNo = this.pageNo;
				let pageSize = this.pageSize;
				if(this.changeDownMoreStatus()){
					return;
				}
				this.getWriteMsg(invitationId,pageNo,pageSize);
			},
			call(){
				console.log(this.user)
				uni.makePhoneCall({
				    phoneNumber: this.user.phone //仅为示例
				});
			},
			addResponseContent(userId,msgId){
				if(this.msgRes.length >= this.total){
					this.$store.dispatch("getResponseMsgContent",{userId,msgId})
					.then(res=>{
						let newMsg = {
							avatar:this.userinfo.avatarUrl,
							createTime:res.createTime,
							gender:this.userinfo.gender,
							id:res.id,
							lastLoginTime:this.userinfo.lastLoginTime,
							msg:res.msg,
							nickname:this.userinfo.nickName,
							resDetail:[],
							resTotal:0,
							userId:res.userId
						}
						this.msgRes.unshift(newMsg)
					}) 
					.catch(e=>{
						console.log(e)
					})
				}else{
					return
				}
			},
			clickMap(){
				 uni.openLocation({
					latitude: Number(this.currentLoc.latitude),
					longitude: Number(this.currentLoc.longitude), 
					success: function () {
						console.log('success'); 
					},
				});
			},
			viewImg(){
				let postData = {
					imgVideoUrl:this.getImgVideoUrl
				}
				this.$store.dispatch("setImgVideoUrlAction",postData)
				uni.navigateTo({
					url: "./viewImgs?id="+this.invitationId+"&responseUserId="+this.detail.userId
				});
			},
			queryCollect(){
				let userId = getStorage('userId');
				let invitationId = this.invitationId;
				this.$store.dispatch("queryCollect",{userId,invitationId})
				.then(res=>{
					this.haveCollect = res.collectStatus
					console.log(this.currentLoc)
				})
				.catch(e=>{
					console.log(e)
				})
			},
			getInfo(){
				let userId = getStorage('userId');
				this.$store.dispatch("requestUserInfo",{userId})
			},
			changeDownMoreStatus(){
				if(this.msgRes.length >= this.total){
					this.downMoreStatus = "noMore";
				}else{
					this.downMoreStatus = "more"
				}
				if(this.downMoreStatus == "noMore"){
					return true;
				}
				return false
			},
			openPost(type){
				this.posterShow = type;
			},
			getInvitation(userId,id){
				this.$store.commit("setLoading",true)
				this.$store.dispatch("getInvitationDetail",{userId,id})
				.then(res=>{
					this.$store.commit("setLoading",false)
					this.detail = res;
					this.currentLoc.detail = res.location.split(',').length>0?res.location.split(',')[0]:""
					this.currentLoc.latitude = Number(res.latitude.split(",")[0])
					this.currentLoc.longitude = Number(res.latitude.split(",")[1])
					console.log(this.currentLoc)
				})
				.catch(e=>{
					console.log(e)
				})
			},
			calLoginDate(dateLogin){
				if(dateLogin){
					dateLogin = dateLogin.toString().replace(/-/g, '/')
				}
				return calloginDate(new Date(dateLogin),new Date());	
			},
			resClick(userId,nickName){
				let myUserId = getStorage('userId')
				if(!this.currentResponseUser.nickName){
					let user={
						id:userId,
						nickName:nickName,
						invitationId:0
					}
					this.$store.dispatch("responseUserAction",user)
					return;
				}
				let msgId=this.currentResponseUser.invitationId;//回复帖子0 回复其他人为消息id
				let responseUserId=this.currentResponseUser.id //回复对象的id
				this.$store.dispatch("responseMsg",{userId:myUserId,invitationId:parseInt(this.invitationId),answerMsgId:msgId,msg:this.res,responseUserId:responseUserId})
				.then(res=>{
					if(!this.detailType){
						this.$store.dispatch("responseUserAction",{})
					}
					this.res=""
					info.toast("发送成功！")
					if(msgId==0){
						this.addResponseContent(userId,res.msgId);
					}else{
						this.responseToUserMsgId=res.msgId
					}
				})
				.catch(e=>{
					console.log(e)
				})
			}
			, 
			getWriteMsg(invitationId,pageNo,pageSize){
				let userId = getStorage('userId'); 
				this.downMoreStatus ="loading"
				this.$store.dispatch("findMsg",{id:userId,invitationId,pageNo,pageSize})
				.then(res=>{
					if(res.details.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					this.msgRes = this.msgRes.concat(res.details);
					this.total = res.total;
					this.changeDownMoreStatus()
				})
				.catch(err=>{
					console.log(err)
				});
			},
			viewAction(userId,invitationId){ 
				this.$store.dispatch("addViewTimes",{userId,invitationId})
				.then(res=>{
				})
				.catch(err=>{
					console.log(err)
				});
			},
			setCurrentSelectMsg(data){
				data["inivitationid"] = this.invitationId;
				this.selectMsg = data;
				this.detailType = true; 
			},
			changeDetailTypeValue(type){
				this.detailType = type;
				this.res=""
			},
			collect(){
				let userId = getStorage('userId'); 
				let invitationId = this.invitationId
				this.$store.dispatch("collect",{userId,invitationId})
				.then(res=>{
					if(res.collectStatus){
						info.toast("已收藏！")
					}else{
						info.toast("已取消收藏！")
					}
					this.haveCollect = res.collectStatus
				})
				.catch(err=>{
					console.log(err)
				});
			}
		},
		watch:{
			responseMsg(v){
				let responseMsgId=v.msgId
				let msgRes = this.msgRes
				let selectMsg = msgRes.filter(v=>{
					return v.id== responseMsgId
				});
				if(selectMsg.length>0){
					if(selectMsg[0].resDetail.length>=5){
						selectMsg[0].resTotal = v.total
						return;
					}
					selectMsg[0].resTotal = v.total
					selectMsg[0].resDetail.push(v.msg)
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		width:100%;
		min-height: 100%;
		background: #FFF;
	}
	.contant-container{
		padding:10upx 10upx 100upx;
		width:100%;
		height: 100%;
		box-sizing: border-box;
	}
	.user-info{
		width:100%;
		height: 70upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 10upx;
		background: #FFF;
		.avatar{
				width:70upx;
				height:70upx;
				border-radius: 100px;
			}
			.user-data{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20upx;
				height: 100%;
				width: calc(100% - 135upx);
				.user-content{
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 40upx;
					.nick-name{
						font-size: 26upx;
						color:$uni-app-font-color;
					}
					.sex-icon{
						margin-left: 10upx;
						width:25upx;
						height: 25upx;
					}
				}
				.come-data{
					height: 30upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.come-text{
						font-size: 24upx;
						color:#999;
						margin-right: 10upx;
					}
				}
			}
			.turn-icon{
				width:45upx;
				height: 45upx;
			}
		}
	.imgVideoContent{
		width:100%;
		height:360upx;
		border-radius: 30upx;
		margin:30upx 0 0 0;
		box-sizing: border-box;
		position:relative;
		
		.img{
			width:100%;
			height:100%;
			box-shadow: 1px 1px 5px #d6d6d6;
			border:1px solid #eaeaea;
			border-radius: 30upx;
		}
		.video{
			width:100%;
			height:100%;
			box-shadow: 1px 1px 5px #d6d6d6;
			border:1px solid #eaeaea;
			border-radius: 30upx;
		}
		.loading{
			width:300upx;
			height:300upx;
			position:absolute;
			left:50%;
			top:50%;
			margin-left: -150upx;
			margin-top: -150upx;
		}
		.icon{
			width:60upx;
			height:60upx;
			position: absolute;
			left:30upx;
			bottom:30upx;
			z-index: 10000;
		}
		.gothrough_detail{
			width:130upx;
			height:60upx;
			position: absolute;
			right:30upx;
			bottom:30upx;
			.goView{
				position: relative;
				.go{
					width:100%;
					height:100%;
					background: #000000;
					opacity: 0.5;
					position: absolute;
					left:0;
					top:0;
					border-radius: 10upx;
				}
				.gothrough_text{
					width:100%;
					height:100%;
					opacity: 1!important;
					font-size: 26upx;
					line-height: 60upx;
					color:#FFF;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					position: relative;
					.goPicture{
						width:50upx;
						height:30upx;
						margin-right: 10upx;
						position: relative;
					}
				}
			}
		}
	}
	.invitation-title{
		width:100%;
		margin:40upx 0 30upx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		padding-left:7upx;
		box-sizing:border-box;
		.title{
			font-size: 40upx;
			font-weight:600;
			color:$uni-app-font-color;
		}
		.location{
			margin-left: 20upx;
			font-size: 26upx;
			color:#999;
		}
	}
	.invitation-condition{
		width:100%;
		padding:0 0 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		.condition{
			display: flex;
			flex-direction: column;
			width: calc(100% - 170upx);
			.budget,.publish,.location{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 10upx;
				margin-bottom: 26upx;
				.img{
					width:40upx;
					height: 40upx;
			     	margin-right: 10upx;
				}
				.condition{
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: flex-start;
				}
				.conditionTab{
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: flex-start;
				}
				.condition-name{
					font-size:30upx;
					color:#999;
					margin-right: 20upx;
				}
				.condition-value{
					font-size: 30upx;
					color:$uni-app-other-color;
				}
			}
			.per{
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				margin-top: 10upx;
				margin-bottom: 26upx;
				.img{
					width:40upx;
					height: 40upx;
				 	margin-right: 10upx;
				}
				.condition{
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: flex-start;
				}
				.conditionTab{
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: flex-start;
				}
				.condition-name{
					font-size:30upx;
					color:#999;
					margin-right: 20upx;
				}
				.condition-value{
					font-size: 30upx;
					color:$uni-app-other-color;
				}
			}
		}
	}
	.location-map{ 
		width:130upx;
		height:130upx;
		border-radius: 100px;
		overflow: hidden;
		margin-right: 40upx;
		.map{
			width:130upx;
			height:130upx;
			border-radius: 100px;
		}
	}
	.invitation-desc{
		width:100%;
		display: flex;
		flex-direction: column;
		.desc{
			margin-top: 30upx;
			.desc-text{
				font-size: 31upx;
				font-weight: 500;
			}
		}
		.desc-content{
			font-size: 33upx;
			padding-left: 7upx;
			color:#999;
			margin-top: 10upx;
			min-height: 130upx;
		}
	}
	.write-msg{
		width:100%;
		display: flex;
		flex-direction: column;
		.desc{
			margin-top: 30upx;
			.desc-text{
				font-size: 31upx;
				font-weight: 500;
			}
		}
		.haveno-msg{
			width:100%;
			display:flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
	}
	.invitation-bottom-tab{
		width:100%;
		height:60upx;
		padding:10upx 20upx;
		display: flex;
		z-index: 1006;
		flex-direction: row;
		background: #FFF;
		border-top: 1px solid $uni-app-border-color;
		position: fixed;
		left:0;
		bottom:0;
		.response-input{
			width:calc(100% - 200upx);
			height:60upx;
			border:1px solid $uni-app-border-color;
			border-radius: 5px;
			font-size: 27upx;
			padding-left: 10upx;
		}
		.tab-content{
			width:110upx;
			height:60upx;
			display: flex;
			margin-right: 25upx;
			flex-direction: row;
			align-items: center;
			position:relative;
			.tab-img{
				width:35upx;
				height: 35upx;
			}
			.tab-text{
				font-size:26upx;
			}
			.return{
				width:100%;
				height:100%;
				position: absolute;
				left:0;
				top:0;
				z-index: 1000;
				opacity: 0;
			}
		}
		.phone{
			width:130upx;
			height:60upx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			position:relative;
			.tab-img{
				width:35upx;
				height: 35upx;
			}
			.tab-text{
				font-size:26upx;
			}
			.return{
				width:100%;
				height:100%;
				position: absolute;
				left:0;
				top:0;
				z-index: 1000;
				opacity: 0;
			}
		}
		.return{
			height:60upx;
			line-height: 60upx;
			text-align: center;
			background: $uni-app-basic-color;
			position: absolute;
			right:60upx;
			top:10upx;
			color:#FFF;
			font-size: 27upx;
		}
	}
</style>
