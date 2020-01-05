<template>
	<view>
		<view class="search">
			<template>
				<input maxlength="20" focus type="text" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索"  v-model.trim="searchText"/>
			</template>
			<image src="../../static/zy-search/search.svg" mode="widthFix" @click="searchStart()" class="search-icon"></image>
		</view>
		<msg-detail  
		:changeConcern="changeConcern" 
		@cancel="cancel" 
		v-for="(item,index) in users" 
		:key="index"
		@getUsers="getUsers" 
		:info ="item" 
		type="1"
		></msg-detail>
		<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
	</view>
</template>

<script>
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import msgDetail from "./msg/index";
	import info from "../../utils/info.js"
	import getStorage from "../../utils/getStorage.js"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {	
				pageNo:1,
				pageSize:10,
				downMoreStatus:"loading",
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多记录"
				},
				users:[],
				searchText:"",
				total:0
			};
		},
		computed:{
		},
		components: {
			uniLoadMore,
			msgDetail
		},
		onShow(){
		},
		onUnload(){
		},
		onReachBottom(){
			this.downReachBottom()
		},
		onLoad(options) {
			this.downReachBottom()
		},
		methods:{
			getUser(content,isRefresh){
				let userId = getStorage("userId")
				this.$store.dispatch("getUser",{userId,content})
				.then(res=>{
					console.log(res)
					if(res.data.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					if(isRefresh){
						this.users = res.data.map(v=>{
								return {
									fromUserid:v.id,
									fromUserNickName:v.nickName,
									fromUserAvatar:v.avatar,
								}
						})
					}else{
						this.users = this.users.concat(res.data.map(v=>{
								return {
									fromUserid:v.id,
									fromUserNickName:v.nickName,
									fromUserAvatar:v.avatar,
								}
							}));
					}
					this.total = res.total;
					this.changeDownMoreStatus()
				})
				.catch(e=>{
					console.log(e)
					info.toast(e.msg)
				})
			},
			searchStart(){
				let content = this.searchText
				this.getUser(content,true)
			},
			downReachBottom(){
				if(this.changeDownMoreStatus()){
					return;
				}
				let content = this.searchText
				this.getUser(searchText)
			},
			changeDownMoreStatus(){
				let data = this.users,
				 total = this.total;
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
