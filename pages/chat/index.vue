<template>
	<view>
		<msg-detail :msgQueue = "msgQueue" @setMsgQueue="setMsgQueue"></msg-detail>
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
		},
		methods:{
		
		},
		watch:{
			
		}
	}
</script>

<style>
</style>
