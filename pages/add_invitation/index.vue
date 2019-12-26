<template>
	<view class="roll-wrap"> 
		<view class="release_tab" @tap="navigateTo" data-page-url="./noHousingPublish/index">  
		    <image class="list-icon" src="../../static/images/publish/wufang1.png"></image>       
			<text class="release_tab_content">我无房</text> 
		</view> 
		<view class="release_tab" @tap="navigateTo" data-page-url="./housing_publish/index?type=1"> 
			<image class="list-icon" src="../../static/images/publish/youfang1.png"></image>       
			<text class="release_tab_content">我有房</text>
		</view> 
		<view class="release_tab" @tap="navigateTo" data-page-url="./housing_publish/index?type=2">  
			<image class="list-icon" src="../../static/images/publish/zhuanzu1.png"></image>       
			<text class="release_tab_content">我转租</text> 
		</view>
	</view>
</template>

<script>       
	export default {
		data() {
			return {
				content: ''
			}
		},
		onLoad(event) {
		
		},
		methods: { 
			navigateTo(e){    
				console.log(e)
				uni.navigateTo({
					url:e.currentTarget.dataset.pageUrl
				})
			}
		}
	}
</script>

<style lang="scss"> 
	@font-face {
		font-family: 'iconfont';  /* project id 1202574 */
		src: url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.eot');
		src: url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.woff2') format('woff2'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.woff') format('woff'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.svg#iconfont') format('svg');
    }
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}
	.release_tab:first-of-type{ 
		margin-top: 200upx;
	}
	.release_tab{ 
		width:90%;
		height:140upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin:0 auto;
		background-color: #FFFFFF;
		margin-bottom: 30upx;
		box-shadow: 1upx 1upx 5px #d5d5d6;
		border-radius: 8upx;
	}
	.release_tab:active{   
		opacity: 0.7;
	}
	.release_tab_content{  
		height: 60upx; 
		line-height: 60upx;
		font-size: 35upx;
		font-weight: bold;
	}
	.release_icon{
		margin-left: 20upx;
		margin-right: 20upx;
	}
	.release_more{
		position: absolute;
		right: 70upx;
	}
	
	
	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.article-meta {
		padding: 20upx 40upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-text {
		font-size: 26upx;
		line-height: 50upx;
		margin: 0 20upx;
	}

	.article-author,
	.article-time {
		font-size: 30upx;
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		margin-bottom: 30upx;
	}
	.list-icon{       
		width: 90upx;  
		height: 90upx; 
		line-height: 90upx;
		font-size: 50rpx; 
		color: $uni-app-basic-color; 
		text-align: center;
		font-family: iconfont; 
		margin: 0 30upx;
	}
</style>
