<template>
	<view class="invitation-container" >
		<view class="main-content" id="main"   @tap="directTo">
			<view class="user-info">
				<image class="avatar" :src="info.avatar?info.avatar:''"></image>
				<view class="user-text-info">
					<view class="user-text-info-1">
						<text class="nickn-name">{{info.publisher?info.publisher:""}}</text>
						<image class="sex-icon" :src="info.gender==0?'../../static/images/home_page/boy.png':'../../static/images/home_page/girl.png'"></image>
					</view> 
					<view class="user-text-info-1">
						<text class="come-text">{{info.lastLoginTime?info.lastLoginTime+"来过":""}}</text>
					</view>
				</view>
				<text class="budget">¥{{info.rental?info.rental:""}}/月</text>
			</view>
			<view class="invitationTag" v-if="type==1">
				<uni-tag :text="item" type="error" :key="index" size="small" :circle="true" :inverted="true" class="tag" v-for="(item,index) in info.remark"></uni-tag>
			</view>
			<view class="invitation-content">
				<view class="invitation-title">
					<text class="invitation-title-text">{{info.title?info.title:""}}</text>
				</view>
<!-- 				<view class="detail-content" v-if="type==0">
					<text class="detail-content-text">{{info.content?info.content:""}}</text>
				</view> -->
			</view>
			<view class="viewResource" v-if="type==1">
				<view class="video-content" v-if="getResourceVideoUrl.currentResource=='video'">
				  <video v-if="getResourceVideoUrl.currentResource=='video'"
						 objectFit="fill" :src="getResourceVideoUrl.url" 
						 class="video" 
						 :show-fullscreen-btn="false"
						 :show-play-btn="false"
						 :show-center-play-btn="false"
						 :controls="false"
				  />
				  <view class="tag-content">
					  <view class="tagBot">
					      <view class="tag"/>
					      <image v-if="getResourceVideoUrl.currentResource=='video'" src="../../static/images/home_page/video.png" class="icon"></image>
					  </view>
				  </view>
				</view>
				<corver-view class="img-content" v-for="(item,index) in getResourceImgUrl.url" :key="index" v-if="getResourceImgUrl.currentResource=='img'">
				  <image :src="item" class="img"></image>
				</corver-view>
				<view class="goViewTap">
					<text>查看详情</text>
				</view>
			</view>
			<view class="bottom-tab">
				<view class="location-info">
					<image class="location-icon" src="../../static/images/home_page/local.png"></image>
					<view class="location-detail">
						<text class="rent-type">{{info.location?(info.location.split(',')[0]):""}}</text>
						<text class="location">/</text>
						<text class="location">{{info.location?(info.location.split(',')[1]):""}}</text>
					</view> 
				</view>
				<view class="view-times">
					<image class="times-icon" src="../../static/images/home_page/view.png"></image>
					<text class="gothrough">浏览{{info.viewTimes?info.viewTimes:0}}次</text>
				</view>
			</view>
		</view>
		<view class="share-bottom" v-if="showBottom">  
		    <view class="comment">
				<view class="content">
					<image class="button-icon" src="../../static/images/home_page/turn.png"></image>
					<text class="button-name">转发</text>
				</view>
				<view class="content">
					<image class="button-icon" src="../../static/images/home_page/writemsg.png"></image>
					<text class="button-name msg-button-name">{{info.leaveMsgNums?info.leaveMsgNums:""}}</text>
				</view>
			</view>
			<view class="comment">
				<view class="content" @tap="agreeStepHandler(0,info.status)">
					<view class="button-content">
						<image :class="'likeAnimation '+ (likeType==0?' getlike':'')" src="../../static/images/home_page/haveAgree.png"/>
						<image class="button-icon" :src="info.status==0?'../../static/images/home_page/haveAgree.png':'../../static/images/home_page/agree.png'"></image>
					</view>
					<text class="button-name agree-button">{{info.supportNums?info.supportNums:0}}</text>
				</view>
				<view class="content" @tap="agreeStepHandler(1,info.status)">
					<view class="button-content">
					  <image :class="'toLikeAnimation '+ (likeType==-1?' getStep':'')" src="../../static/images/home_page/haveStep.png"/>
					  <image class="button-icon" :src="info.status==1?'../../static/images/home_page/haveStep.png':'../../static/images/home_page/step.png'"></image>
				    </view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {calloginDate} from "../../utils/calDateDiff.js"
	import {qqmapsdk} from "../../utils/QQMapWXConfig.js";
	import info from '../../utils/info.js';
	import {getNodeHeight} from "../../utils/config.js"
	import configUrl from "../../utils/config_utils.js"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	export default {
		data() {
			return {
					imgUrl:configUrl.uploadFileUrl,
					contentHeight:0,
					likeType:1,
					likeInvitation:{}
			} 
		}, 
		props: {
			dat: Object,
			type:0,
			showBottom:Boolean
		},
		computed:{
			info(){
				console.log(this.likeInvitation)
				let list = {};
				let likeObj = {}
				if(Object.keys(this.likeInvitation).length>0){
					likeObj["status"] = this.likeInvitation.status;
					likeObj["supportNums"] = this.likeInvitation.supportNums;
				}
				let dateStr = this.dat.lastLoginTime.replace(/-/g, '/')
				let ori = {
					   lastLoginTime:calloginDate(new Date(dateStr),new Date()),
					   locationProvince:this.dat.location?(this.dat.location.split(',')[0]):"",
					   locationCity:this.dat.location?(this.dat.location.split(',')[1]):""		,
					   remark:this.dat.remark?this.dat.remark.split(','):[]
					}
				if(this.dat){
					Object.assign(list,this.dat,ori,likeObj);
				}
				return list;
			} ,
			getResourceVideoUrl(){ 
				if(this.dat.housingVideos){
					let path = this.dat.housingVideos.replace(/\\/g,"/")
					return {
						url:this.imgUrl+path,
				        currentResource:"video"					
					}
				} 
				return ""
			},
			getResourceImgUrl(){
				if(this.dat.housingImgs){
					let housingImgs = this.dat.housingImgs.split(",").map((v,i)=>{
							v=v.replace(/\\/g,"/");
							return this.imgUrl+v;
						});
				    if(this.dat.housingVideos){
						housingImgs = housingImgs.slice(0,2)
					}else{
						housingImgs = housingImgs.slice(0,3)
					}
					return {
						url:housingImgs,
						currentResource:"img"
					}
				}
				return ""
			}
		},
		components: {
			uniTag
		},
	    mounted() {
		},
		methods: {
			
			directTo() {
				uni.navigateTo({
					url: "../../pages/home_page/content/index?id="+this.info.id
				})
			},
			getDeitailInvitation(userId,invitationId){
				this.$store.dispatch("getInvitationDetail",{
					userId,
					id:invitationId
				}).then(res=>{
					console.log(res)
					this.likeInvitation = res;
				}).catch(e=>{
					console.log(e)
				})
			},
			agreeStepHandler(status,preStatus){
				const userId = uni.getStorageSync('userId');
				let invitationId= this.info.id;
				this.$store.dispatch("agreeStepAction",{
					likeUserId:userId,
					likeInvitationId:this.info.id,
					status
				}).then(res=>{
					console.log(status)
					console.log(preStatus)
					if(status==0&&preStatus!=0){
						this.likeType=0;
						let timeGetLikeInterval = setTimeout(()=>{
							this.likeType = 1;
							console.log(this.likeType)
							clearTimeout(timeGetLikeInterval)
						},1000)
						console.log(this.likeType)
					}
					if(status==1&&preStatus!=1){
						this.likeType=-1;
						let timeHaveLikeInterval = setTimeout(()=>{
							this.likeType = 1;
							clearTimeout(timeHaveLikeInterval)
						},1000)
						console.log(this.likeType)
					}
					this.getDeitailInvitation(userId,invitationId)
					console.log(res)
					
				}).catch(e=>{
					console.log(e)
					info.toast(e.msg);
				});
			}
			
			
		},
		watch: {}
	}
</script>

<style lang="scss">
	.invitation-container {
		width: calc(100% - 40upx);
		margin: 20upx;
		background: #FFF;
		padding-top: 20upx;
		border-radius: 10upx;
		box-shadow: 1px 1px 5px #d6d6d6;
		position: relative;
		// height: 360upx;
		.main-content{
			width:100%;
		}
		.user-info {
			width: calc(100% - 40upx);
			height: 70upx;
			padding: 10upx 20upx;
			display: flex;
			flex-direction: row;
			align-items: center;

			.avatar {
				width: 70upx;
				height: 70upx;
				border-radius: 100px;
			}

			.user-text-info {
				width: calc(100% - 270upx);
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.user-text-info-1 {
				width: 100%;
				height: 60%;
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.user-text-info-2 {
				width: 100%;
				height: 40%;
			}

			.nickn-name {
				font-size: 28upx;
				font-weight: bold;
				margin-left: 30upx;
				margin-right: 10upx;
			}

			.sex-icon {
				width: 30upx;
				height: 30upx;
			}

			.come-text {
				font-size: 24upx;
				color: #9a9a9a;
				margin-left: 30upx;
			}

			.budget {
				font-size: 28upx;
				position: absolute;
				right: 30upx;
				color: $uni-app-other-color;
				width: 200upx;
				color: #ff775c;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-end;
			}

				.close-btn {
					font-size: 28upx;
					color: #666;
					position: absolute;
					right: 60upx;
					top: 30upx;
				}
			}
			
			.invitationTag{
				width:100%;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				padding:10upx 20upx;
				box-sizing: border-box;
				.tag{
					margin-right: 30upx;
				}
			}

			.invitation-content {
				width: 100%;

				// height:200upx;
				.invitation-title {
					height: 70upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					padding-left: 20upx;

					.invitation-title-text {
						font-size: 28upx;
					}
				}

// 				.detail-content {
// 					display: flex;
// 					flex-direction: row;
// 					flex-wrap: wrap;
// 					height: auto;
// 					width: calc(100% - 40upx);
// 					padding: 10upx 20upx;
// 
// 					.detail-content-text {
// 						font-size: 28upx;
// 						color: #333;
// 					}
// 				}
			}
			
			.viewResource{
				width:100%;
				height:160upx;
				margin:0 0 10upx 0;
				box-sizing: border-box;
				position: relative;
				display:flex;
				flex-direction:row;
				align-items:center;
				overflow-x:auto;
				padding:0 20upx;
				.video-content{
					width:33.3%;
					height:100%;
					position:relative;
					.video{
						width:100%;
						height:100%;
					}
					.tag-content{
						min-width:60upx;
						height:50upx;
						display:flex;
						flex-direction:row;
						justify-content:center;
						align-items:center;
						position:absolute;
						border-top-left-radius: 10upx;
						border-bottom-left-radius: 10upx;
						right:0upx;
						bottom:50upx;
						.tagBot{
							position: relative;
							.tag{
								width:100%;
								height:100%;
								position: absolute;
								left:0;
								top:0;
								background: #000000;
								opacity: 0.5;
							}
							.icon{
								width:50upx;
								height:50upx;
								position: relative;
							}
						}
					}
				}
				.img-content{
					width:33.3%;
					height:100%;
					position:relative;
					.img{
						width:100%;
						height:100%;
						position: absolute;
						left:0;
						top:0;
					}
				}
				.goViewTap{
					width:30upx;
					height:100%;
					position: absolute;
					right:30upx;
					top:0;
					background: #000000;
					opacity: 0.7;
					color: #FFF;
					font-size: 26upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}

			.bottom-tab {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding:10upx 0;

				.location-info {
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 10upx 20upx;
					height: 50upx;

					.location-icon {
						width: 40upx;
						height: 40upx;
					}

					.location-detail {
						height: 30upx;
						display: flex;
						flex-direction: row;
						align-items: center;

						.rent-type {
							max-width:300upx;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							font-size: 28upx;
							font-weight: bold;
							
						}

						.location {
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							font-size: 26upx;
							color: #CCC;
							margin-left: 10upx;
							margin-right: 10upx;

							&:last-child {
								margin-left: 0;
							}
						}
					}
				}

				.view-times {
					width: 50%;
					margin-right: 20upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-end;

					.times-icon {
						width: 35upx;
						height: 35upx;
						margin-right: 5upx;
					}

					.gothrough {
						height: 35upx;
						line-height: 35upx;
						font-size: 24upx;
						// font-weight: 200;
						color: #9a9a9a;
					}
				}
			}

			.share-bottom {
				width: calc(100% - 40upx);
				height:50upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-top: 1px solid $uni-app-border-color;
				padding: 10upx 20upx;
				.comment{
					width:50%;
					display: flex;
					flex-direction: row;
					align-items: center;
					.content {
						margin-right: 10upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-around;
						position:relative;
						.button-content{
							width:45upx;
							height:45upx;
							position:relative;
							.likeAnimation{
								width:100%;
								height:100%;
								position:absolute;
								left:0;
								top:0;
								opacity: 1;
							}
							.toLikeAnimation{
								width:100%;
								height:100%;
								position:absolute;
								left:0;
								bottom:0;
								opacity: 1;
							}
							.getlike{
								top:-100upx;
								opacity:0;
								transition: all 1s;
							}
							.getStep{
								bottom:-100upx;
								opacity:0;
								transition: all 1s;
							}
							.button-icon {
								position:absolute;
								left:0;
								top:0;
								width: 100%;
								height: 100%;
							}
						}
						.button-icon {
							width:45upx;
							height:45upx;
						}
						.button-name {
							width:100upx;
							font-size: 26upx;
							color: $uni-app-font-color;
						}
						.msg-button-name{
							margin-left: 5upx;
						}
						.agree-button{
							text-align: center;
						}
					}
					&:nth-of-type(2){
						justify-content: flex-end;
					}
				}
			}
		}

</style>
