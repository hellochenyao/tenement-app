<template>
	<view class="contain">
		<msg-detail v-for="(item,index) in connectUsers" :info ="item"></msg-detail>
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
		onLoad() {
			let userId = getStorage('userId');
			let req={
				userId,
				msgQueue:this.msgQueue
			}
			this.$store.dispatch("connectWebSocketMsg",req);
			this.$store.dispatch("findConnectingUsers",{userId,pageNo:1,pageSize:10})
			.then(res=>{
				this.connectUsers = res.messages;
			})
			.catch(e=>{
				console.log(e)
			});
		},
		methods:{
		
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
