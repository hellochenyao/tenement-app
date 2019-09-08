<template>
	<view class="loading" v-if="loading">
		<image class="loading-img" src="../../static/images/home_page/timg.gif"/>
	</view>
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
		computed:{
			...mapState({ 
				loading:state=>{
					console.log(state)
					return state.invitateStore.loading
				}
			})
		},
		onLoad(event) {
		},
		onShow(event){
		},
		methods: {
		},
		watch:{
			scrollAnimation(v){
				console.log(v)
			}
		}
	}
</script>

<style lang="scss">
	.loading{
		width:100%;
		height:100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position:fixed;
		left:0;
		top:0;
		.loading-img{
			width:300upx;
			height:300upx;
		}
	}
</style>
