<template> 
	<view>
		<view class="container">
			<view class="wordcontent" v-for="(item,index) in dataList">
				<view class="user-info">
					<image class="avatar" :src="item.userAvatr"></image>
					<view class="user-data">
						<view class="user-content">
							<text class="nick-name">{{item.userNickName}}</text>
							<image class="sex-icon" :src="detail.gender==0?'../../../static/images/home_page/boy.png':'../../../static/images/home_page/girl.png'"></image>
						</view>
					<view class="come-data">
						<text class="come-text">{{detail.lastLoginTime?calLoginDate(detail.lastLoginTime):""}}</text>
					</view>
				</view> 
			</view>
			<view class="toUserContent">
				<text class="content">{{item.content}}</text>
			</view>
			<view class="textValue">
				<text class="content">{{item.responseContent}}</text>
			</view>
			</view>
			<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import RestApi from "../../utils/restApi/index.js";
	import getStorage from "../../utils/getStorage.js"
	import uniListItem from "../../components/uni-list-item/uni-list-item.vue"
	import uniList from "../../components/uni-list/uni-list.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import {  
	    mapState,  
	    mapMutations, 
		mapActions 
	} from 'vuex';
	
	export default {
		data() {
			return {
				downMoreStatus:"loading",
				dataList:[],
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多记录"
				},
				pageNo:1,
				pageSize:10,
				total:0
			}
		},
		components: {
			uniLoadMore,
			uniList,
			uniListItem
		},
		computed:{
			...mapState({ 
				
			})
		}, 
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {

		},
		onLoad(event) {
			this.getWord();
		},
		onReachBottom(){
			this.downReachBottom()
		},
		onShow(event) {	
		},
		methods: {
			downReachBottom(){
				let pageNo = this.pageNo;
				let pageSize = this.pageSize;
				if(this.changeDownMoreStatus()){
					return;
				}
				this.getWord();
			},
			getWord(status){
				let userId = getStorage("userId")
				let pageNo = this.pageNo;
				let pageSize = this.pageSize;
				let postData = {userId,pageNo,pageSize};
				postData["isHaveResponse"] = this.isHaveResponse;
				this.$store.dispatch("requestWord",postData)
				.then(res=>{ 
					console.log(res)
					if(res.data.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					this.dataList = this.dataList.concat(res.data);
					this.total = res.total;
					this.changeDownMoreStatus()
				})
				.catch(e=>{
					console.log(e)
				})
			},
			changeDownMoreStatus(){
				if(this.dataList.length >= this.total){
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
	}
	.toUserContent{
		width:100%;
		flex-direction: row; 
		justify-content: flex-start;
		align-items: center;
		.content{
			font-size: 36upx;
			word-break: break-all;
		}
	}.container{
		width:100%;
	}
	page{
		width:100%;
		background: #FFF;
	}
	.textValue{
		width:100%;
		min-height: 100upx;
		background: #C0C0C0;
		line-height: 100upx;
		flex-direction: row; 
		justify-content: flex-start;
		align-items: center;
		padding-left:30upx;
		box-sizing:border-box;
		.content{
			font-size: 30upx;
			word-break: break-all;
		}
	}
	.wordcontent{
		width:100%;
		background: #FFF;
		padding: 20upx 20upx;
		box-sizing: border-box;
		border-bottom:3upx solid #C0C0C0;
	}
</style>
