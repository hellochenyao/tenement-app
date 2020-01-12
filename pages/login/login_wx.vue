<template>
	<view>
	<View class="title-content">
		<text class="title-text">欢迎使用住住侠</text>
	</view>
	<button class="authorize-button" @getuserinfo="getUserInfo" open-type="getUserInfo">开始使用</button>
	</view>
</template> 

<script>
	import getStorage from '../../utils/getStorage.js';
	export default {
		data() { 
			return {
				
			}
		},
		components: {
			
		},
		methods: {
			getUserInfo(){  
				let userId = getStorage('userId');
				if(!userId){
					this.$store.dispatch("loginAction");
				}
			},
		}
	}
</script>

<style lang="scss"> 
	.title-content{
		width:100%;
		height:600upx;
		display:flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.title-text{
			font-size: 50upx;
			color:$uni-app-basic-color;
			font-family:"Times New Roman", Times, serif;
		}
	}
	.authorize-button{
		width:300upx;
		height:80upx;
		background: $uni-app-basic-color;
		color:#FFF;
		line-height: 80upx;
	}
</style>
