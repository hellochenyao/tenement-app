<template>
	<view>
	  <view class="status_bar">
          <!-- 这里是状态栏 -->
      </view>
      <view class="nav_content" :style="{height:titleHeight+'px'}">
		  <image src="../../static/back.png" class="back"></image>
		  <text class="title">{{title}}</text>
	  </view>
	  <image class="title-img" :src="requestUrl+'im/userBack/back.jpg'" mode="scaleToFill"></image>
	  <view class="content" :style="{marginTop:calHeight}">
		  <image class="userIcon" :src="userInfo.avatar?userInfo.avatar:''"></image>
		  <view class="userInfo">
			  <view class="userCenter">
				  <view class="nickName">
				      <text class="nickNameValue">{{userInfo.nickName?userInfo.nickName:''}}</text>
				  </view>
				  <image class="sex" :src="userInfo.gender&&userInfo.gender==0?'../../static/images/home_page/boy.png':'../../static/images/home_page/girl.png'"></image>
			  </view>
			  <view class="relation">
				  <view class="concern">
					<text class="concernNum">6</text>
					<text class="concernText">粉丝</text>
				  </view>
				  <view class="concern">
				  	<text class="concernNum">6666</text>
				  	<text class="concernText">关注</text>
				  </view>
			  </view>
			  <view class="introdction">
				  <text class="name">简介:</text>
				  <text class="value"></text>
			  </view>
		  </view>
	  </view>
	</view>
</template>

<script>
	import getStorage from "../../utils/getStorage.js";
	import configUrl from "../../utils/config_utils.js"
	export default {
		data() { 
			return {
				titleHeight:0,
				requestUrl:configUrl.imagesUrl,
				userInfo:{},
				title:""
			}
		},
		components: {

		},
		computed:{
			calHeight(){
				return uni.upx2px(300) - 25 - this.titleHeight+"px";
			}
		},
		onLoad(option) {
			let fromUserId = option.fromUserId
			let data = wx.getMenuButtonBoundingClientRect()
			let userId = getStorage("userId");
			console.log(data)
			this.titleHeight = data.height;
			this.reqUserInfo(fromUserId)
            this.title=userId==fromUserId?"我的主页":"TA的主页"
			this.$store.dispatch("getUserInfo");
		},
		onShow(){
		},
		methods: {
			reqUserInfo(fromUserId){
				this.$store.dispatch("requestUserInfo",{userId:fromUserId})
				.then(res=>{
					console.log(res);
					this.userInfo = res;
				})
				.catch(e=>{
					console.log(e)
				})
			}
		}
	}
</script>

<style lang="scss">
	.status_bar {
      height: var(--status-bar-height);
      width: 100%;
  }
  .nav_content{
	  width:100%;
	  display: flex;
	  flex-direction: row;
	  justify-content: flex-start;
	  align-items: center;
	  .back{
		  width:60upx;
		  height:60upx;
	  }
	  .title{
		  width:calc(100% - 60upx);
		  margin-left: -60upx;
		  height:60upx;
		  line-height: 60upx;
		  text-align: center;
		  color:#FFF;
	  }
  }
  .title-img{
	  width:100%;
	  height:300upx;
	  position: absolute;
	  left:0;
	  top:0;
	  z-index: -100;
  }
  .content{
	  width:100%;
	  position: relative;
	  padding-top: 100upx;
	  .userIcon{
		  width:160upx;
		  height:160upx;
		  border-radius: 50%;
		  position: absolute;
		  left:60upx;
		  top:-60upx;
		  z-index: 100;
	  }
	  .userInfo{
		  padding-left: 60upx;
		    .userCenter{
		  		  width:100%;
		  		  height:100upx;
		  		  display: flex;
		  		  flex-direction: row;
		  		  justify-content: flex-start;
		  		  align-items: center;
		  		  .nickName{
					  height:36upx;
					  line-height: 36upx;
					  .nickNameValue{
						  font-size: 50upx;
						  font-weight: bold;
					  }
		  		  }
		  		  .sex{
		  			  width:36upx;
		  			  height:36upx;
		  			  margin-left: 30upx;
		  		  }
		  }
		  .relation{
			  width:100%;
			  display: flex;
			  flex-direction: row;
			  justify-content: flex-start;
			  align-items: center;
			  .concern{
				  height: 60upx;
				  margin-right: 30upx;
				  display: flex;
				  flex-direction: row;
				  justify-content: flex-start;
				  align-items: center;
				  font-size: 26upx;
				  .concernNum{
					  font-size: 30upx;
					  text-align: right;
					  margin-right: 10upx;
					  color:#00C;
				  }
				  .concernText{
					  font-size: 30upx;
					  text-align: center;
				  }
			  }
		  }
		  .introdction{
			  width:100%;
			  height: 60upx;
			  display: flex;
			  flex-direction: row;
			  justify-content: flex-start;
			  align-items: center;
			  .name{
				  color:#CCC;
				  font-size: 30upx;
			  }
			  .value{
				  color:#CCC;
				  font-size: 30upx;
			  }
		  }
	  }
  }
</style>
