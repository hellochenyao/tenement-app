<template>
	<view>
		<view class="choose">
			<view class="search">
				<template>
					<input maxlength="20" focus="false" disabled="true" type="text" @tap="search()"/>
				</template>
				<image src="../../static/zy-search/search.svg" mode="widthFix" @click="searchStart()" class="search-icon"></image>
			</view>
			<view class="QS-tabs-box">
				<QSTabs 
				ref="tabs" 
				 id="tab"
				:tabs="tab" 
				animationMode="line3" 
				:current="current" 
				@change="change"
				activeColor="#adadad"
				lineColor="#f1505c"
				swiperWidth="750">
				</QSTabs>
			</view>
		</view>
	<swiper 
	:style="{height: swiperHeight + 'px',marginTop: tabHeight + 'px'}"
	:current="swiperCurrent" 
	@transition="transition"
	@animationfinish="animationfinish">
		<swiper-item class="swiper-item" id="swiper">
			<msg-detail v-for="(item,index) in connectUsers" @cancel="cancel" @changeFilterUserId="changeFilterUserId" :key="index" @getUsers="getUsers" :info ="item" type="0"></msg-detail>
			<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
		</swiper-item>
		<swiper-item class="swiper-item" id="swiper">
			<msg-detail v-if="filterUserId.indexOf(item.fromUserid)==-1" :optUserId="optUserId" :changeConcern="changeConcern" @cancel="cancel" v-for="(item,index) in concernUsers" @changeFilterUserId="changeFilterUserId" :key="index" @getUsers="getUsers" :info ="item" type="1"></msg-detail>
			<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
		</swiper-item>
		<swiper-item class="swiper-item" id="swiper">
			<msg-detail v-for="(item,index) in fans" :optUserId="optUserId" :changeConcern="changeConcern" @cancel="cancel" @changeFilterUserId="changeFilterUserId" :key="index" @getUsers="getUsers" :info ="item" type="2"></msg-detail>
			<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
		</swiper-item>
	</swiper>
	<min-action-sheet ref="as1">
		  <view style="padding: 32rpx">
			<view style="font-size: 32rpx">确定不再关注？</view>
		</view>
	</min-action-sheet>
	</view>
</template>

<script>
	import msgDetail from "./msg/index";
	import QSTabs from '../../components/QS-tabs/QS-tabs.vue';
	import zySearch from '../../components/zy-search/zy-search.vue'
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import info from "../../utils/info.js"
	import getStorage from "../../utils/getStorage.js"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
	import {getNodeHeight} from "../../utils/config.js"
	export default {
		data() {
			return {	
				connectUsers:[],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				pageNo:1,
				pageSize:10,
				tab:["聊天","关注","粉丝"],
				tabHeight:0,
				contentHeight:0,
				concernUsers:[],
				fans:[],
				connectTotal:0,
				concernTotal:0,
				fansTotal:0,
				downMoreStatus:"loading",
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多记录"
				},
				filterUserId:[],
				changeConcern:false,
				init:false,
				optUserId:0
			};
		},
		computed:{
			swiperHeight(){
				if(this.swiperCurrent==0){
					return this.connectUsers.length*uni.upx2px(130) +60
				}else if(this.swiperCurrent ==1){
					console.log(this.concernUsers.length)
					return (this.concernUsers.length-this.filterUserId.length)*uni.upx2px(130) +60
				}else {
					return this.fans.length * uni.upx2px(130) +60
				}
			},
			...mapState({ 
				socketOpen:state=>state.privateMsgStore.socketOpen,
				msgQueue:state=>state.privateMsgStore.msgQueue
			})
		},
		components: {
			msgDetail,
			zySearch,
			QSTabs,
			uniLoadMore,
			minActionSheet
		},
		onShow(){
			let userId = getStorage('userId');
			this.getUsers(userId,false,true)
		},
		onUnload(){
			this.connectUsers = []
			this.concernUsers = []
			this.fans = []
		},
		onPullDownRefresh(){
			let userId = getStorage('userId');
			if(this.swiperCurrent == 0){
				this.getUsers(userId,true);
			}else if(this.swiperCurrent == 1){
				this.getFans(0,true);
			}else{
				this.getFans(1,true);
			}
		},
		onReachBottom(){
			this.downReachBottom()
		},
		onLoad(options) {
			let userId = getStorage('userId');
			this.tabHeight = this.changeRpx(80) + uni.upx2px(110)
			console.log(this.tabHeight)
			let req={
				userId
			}
			this.$store.dispatch("connectWebSocketMsg",req);
			this.getHeight("tab")
			let _this = this;
			uni.getSystemInfo({
				success(res) { 
					console.log(res)
					_this.contentHeight = res.windowHeight - _this.tabHeight;
					console.log(_this.contentHeight)
				}
			});
		},
		methods:{
			getUsers(userId,isRefresh,change){
				if(isRefresh){
					uni.showLoading({
						title: '加载中'
					});
				}
				this.$store.dispatch("findConnectingUsers",{userId,pageNo:this.pageNo,pageSize:this.pageSize})
				.then(res=>{
					if(isRefresh){
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
					if(change){
						this.connectUsers = res.messages;
					}else{
						this.connectUsers = this.connectUsers.concat(res.messages);
					}
					this.connectTotal = res.total;
					if(res.messages.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					this.changeDownMoreStatus()
				})
				.catch(e=>{
					console.log(e)
					info.toast(e.msg)
					if(isRefresh){
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				});
			},
			search(){
				uni.navigateTo({
					url: "./serch"
				});
			},
			cancel({toUserId}){
				this.$refs.as1.handleShow({
					actions: [
						{
						  name: '确定'
						}
					],
					success: (res) => {
						switch (res.id) {
						     // -1代表取消按钮
						  case -1:
						    console.log(res)
						   break
						  case 0:
						   this.optUserId = toUserId;
						    this.changeConcern = !this.changeConcern;
						     break
						 }
					}
				})
			},
			changeFilterUserId({userId,type}){
				let index = this.filterUserId.indexOf(userId);
				if(type==0&&index==-1){
					this.filterUserId.push(userId)
				}else if(type==1){
					this.filterUserId = []
				}
				console.log(this.filterUserId)
			},
			downReachBottom(){
				console.log("aa")
				let userId = getStorage('userId');
				if(this.changeDownMoreStatus()){
					return;
				}
				if(this.swiperCurrent == 0){
					this.getUsers(userId,false);
				}else if(this.swiperCurrent == 1){
					this.getFans(0,false);
				}else{
					this.getFans(1,false);
				}
			},
			changeRpx(rpx){
				return rpx / 750 * wx.getSystemInfoSync().windowWidth
			},
			getHeight(id){
				let _this = this;
				const query = uni.createSelectorQuery().in(this); 
				query.select('#'+id).boundingClientRect(data => {
					console.log(data)
				}).exec();
			},
			change(index) {
				let userId = getStorage('userId');
				this.filterUserId = []
				this.pageNo = 1;
				this.swiperCurrent = index;
				if(index == 0){
					this.getUsers(userId,false,true);
				}else if(index == 1){
					this.getFans(0,false,true);
				}else if(index==2){
					this.getFans(1,false,true)
				}
			},
			transition({ detail: { dx } }) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({detail: { current }}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			getFans(type,isRefresh,change){
				let userId = getStorage('userId');
				if(isRefresh){
					uni.showLoading({
						title: '加载中'
					});
				}
				this.$store.dispatch("getFans",{concernType:"USER",userid:userId,type,pageNo:this.pageNo,pageSize:this.pageSize})
				.then(res=>{
					console.log(res)
					if(res.data.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					if(!type){
						if(change){
							this.concernUsers = res.data.map(v=>{
								return {
									fromUserid:v.userid,
									fromUserNickName:v.nickName,
									fromUserAvatar:v.avatar,
								}
							});
						}else{ 
							this.concernUsers = this.concernUsers.concat(res.data.map(v=>{
								return {
									fromUserid:v.userid,
									fromUserNickName:v.nickName,
									fromUserAvatar:v.avatar,
								}
							}))
						}
						this.concernTotal = res.total;
					}else{
						if(change){
							this.fans = res.data.map(v=>{
								return {
									fromUserid:v.userid,
									fromUserNickName:v.nickName,
									fromUserAvatar:v.avatar,
								}
							})
						}else{
							this.fans = this.fans.concat(res.data.map(v=>{
								return {
									fromUserid:v.userid,
									fromUserNickName:v.nickName,
									fromUserAvatar:v.avatar,
								}
							}))
						}
						this.fansTotal = res.total;
					}
					if(isRefresh){
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
					this.changeDownMoreStatus()
				})
				.catch(e=>{
					console.log(e)
					info.toast(e.msg)
					if(isRefresh){
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				})
			},
			changeDownMoreStatus(){
				let data = [],
				 total = 0;
				if(this.swiperCurrent == 0){
					data = this.connectUsers;
					total = this.connectTotal;
				}else if(this.swiperCurrent == 1){
					data = this.concernUsers;
					total = this.concernTotal
				}else {
					data = this.fans
					total = this.fansTotal
				}
				console.log(data)
				if(data.length >= total){
					this.downMoreStatus = "noMore";
				}else{
					this.downMoreStatus = "loading"
				}
				if(this.downMoreStatus == "noMore"){
					return true;
				}
				return false
			}
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	page{
		width:100%;
		background: #FFF!important;
	}
	.choose{
		width:100%;
		position:fixed;
		left:0;
		top:0;
		z-index:1000;
		background: #FFF;
	}
	.QS-tabs-box{
		width: 100%;
		z-index: 10;
		background-color: #F7F7F7;

	}
	.swiper-item{
		background-color: #fff;
	}
	.contain{
		flex: 1;
	}
	.search{
		width: 95%;
		margin: 10upx auto 30upx;
		position: relative;
		input{
			width:100%;
			box-sizing: border-box;
			background: #F7F7F7;
			height: 70upx;
			padding-left: 20upx;
			line-height: 70upx;
			font-size: 30upx;
		}
		.search-icon{
			width: 36upx;
			height: 36upx;
			padding: 16upx 20upx 16upx 0;
			position: absolute;
			right: 0;
			top: 2upx;
			z-index: 10;
		}
	}
</style>
