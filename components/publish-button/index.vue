<template>
	<view>
		<button class="publish-btn" @getuserinfo="getUserInfo" open-type="getUserInfo" :disabled="publishBtnDisabled" @tap="clickHandle">{{btnName}}</button> 
	</view>
</template>

<script>
	export default {  
		props:['publishBtnDisabled','btnName'],
		data() {
			return { 
				
			}; 
		},
		methods:{ 
			clickHandle(){
				this.$emit("clickHandle");
			},
			getUserInfo(){
				this.$emit("getUserInfoHandle");
			}
		}
	}
</script>

<style lang="scss">
	.publish-btn{        
		width:75%;
		height:75upx;
		line-height: 75upx; 
		margin-top: 70upx;
		margin-bottom: 50upx;
		border-radius: 50px;
		background-color:$uni-app-basic-color; 
		color: #FFF;
	}
	.publish-btn:active{
		opacity: $uni-app-active-btn-opacity;
	}
</style>
