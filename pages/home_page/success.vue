<template>
	<view>
		<view class="success">
			<image src="../../static/images/home_page/success.png" class="pic" mode="widthFix"></image>
			<text class="text">发布成功</text>
		</view>
		<button type="default" class="view" @tap="goDetail()">查看帖子</button>
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
				invitationId:0
			}
		},
		mounted() {
			
		}, 
		onLoad(event) {
			this.invitationId = event.id
		},
		onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false; 
		}
		uni.switchTab({
			url: "../add_invitation/index?id="+this.invitationId
		})
		return true; 
		},
		methods: { 
			goDetail(){ 
				console.log("a")
				uni.navigateTo({
					url: "../home_page/content/index?id="+this.invitationId
				})
			}
		},
		watch:{
		}
	}
</script>

<style>
	.success{
		width:70%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 15%;
		top:30%;
	}
	.pic{
		width:90upx;
		height: 90upx;
		margin-right: 30upx;
	}
	.text{
		font-size: 40upx;
		color:#000;
		font-weight: bold;
	}
	.view{
		width:230upx;
		height:60upx;
		color:#f0f0f0;
		font-size: 30upx;
		position: absolute;
		right: 50%;
		top:50%;
		display: flex;
		margin-right: -115upx;
		justify-content: center;
		align-items: center;
	}
</style>
