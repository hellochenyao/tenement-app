<template>
	<view class="contain">
		<msg-detail v-for="(item,index) in connectUsers" :key="index" @getUsers="getUsers" :info ="item"></msg-detail>
	</view>
</template>

<script>
	import msgDetail from "./msg/index";
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import getStorage from "../../utils/getStorage.js"
	export default {
		data() {
			return {	
				connectUsers:[]
			};
		},
		computed:{
			...mapState({ 
				socketOpen:state=>state.privateMsgStore.socketOpen,
				msgQueue:state=>state.privateMsgStore.msgQueue
			})
		},
		components: {
			msgDetail
		},
		onShow(){
			let userId = getStorage('userId');
			this.getUsers(userId)
			uni.getSystemInfo({
			    success: function (res) {
			        console.log(res);
			    }
			});
		},
		onPullDownRefresh(){
			uni.showLoading({
				title: '加载中'
			});
			let userId = getStorage('userId');
			this.$store.dispatch("findConnectingUsers",{userId,pageNo:1,pageSize:10})
			.then(res=>{
				uni.hideLoading()
				this.connectUsers = res.messages;
				uni.stopPullDownRefresh()
			})
			.catch(e=>{
				console.log(e)
				uni.hideLoading()
				uni.stopPullDownRefresh()
			});
		},
		onLoad(options) {
			let userId = getStorage('userId');
			let req={
				userId
			}
			this.$store.dispatch("connectWebSocketMsg",req);
			this.getUsers(userId);
		},
		methods:{
			getUsers(userId){
				this.$store.dispatch("findConnectingUsers",{userId,pageNo:1,pageSize:10})
				.then(res=>{
					this.connectUsers = res.messages;
				})
				.catch(e=>{
					console.log(e)
				});
			}
		},
		watch:{
			
		}
	}
</script>

<style>
	.contain{
		width:100%;
		height:100%;
		overflow: hidden;
	}
</style>
