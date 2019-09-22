<template>
	<live-player
	  src="http://182.61.48.161:1935/live/a/index.m3u8"
	  autoplay
	  @statechange="statechange"
	  @error="error"
	  style="width: 300px; height: 225px;"
	/>
</template>

<script>
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				
			}
		},
		onLoad(option) {
		},
		computed:{
		}, 
		onShow(){
		},
		methods:{
			statechange(e){
			    console.log('live-player code:', e.detail.code)
			},
		    error(e){
			    console.error('live-player error:', e.detail.errMsg)
			}
		}	
	}
</script>

<style>
</style>
