<template>
	<view>
	  <view class="status_bar">
          <!-- 这里是状态栏 -->
      </view>
      <view class="nav_content" :style="{height:titleHeight+'px'}">
		  <image src="../../static/back.png" class="back" @tap="goBack"></image>
		  <text class="title">{{title}}</text>
	  </view>
	  <image class="title-img" :src="requestUrl+'im/userBack/back.jpg'" mode="scaleToFill"></image>
	  <view class="content" :style="{marginTop:calHeight}">
		  <image class="userIcon" :src="userInfo.avatar?userInfo.avatar:''"></image>
		  <view class="button-group">
			  <button class="user-option"  type="primary" size="mini" @tap="gotoDetailMsg(userInfo.nickName)">发消息</button>
			  <button class="user-option" type="primary" size="mini" @tap="concern(isConcernType)">{{isConcernType==0?'关注TA':'取消关注'}}</button>
		  </view>
		  <view class="userInfo">
			  <view class="userCenter">
				  <view class="nickName">
				      <text class="nickNameValue">{{userInfo.nickName?userInfo.nickName:''}}</text>
				  </view>
				  <image class="sex" :src="userInfo.gender&&userInfo.gender==0?'../../static/images/home_page/boy.png':'../../static/images/home_page/girl.png'"></image>
			  </view>
			  <view class="relation">
				  <view class="concern">
					<text class="concernNum">{{concernInfo.concernNums?concernInfo.concernNums:0}}</text>
					<text class="concernText">粉丝</text>
				  </view>
				  <view class="concern">
				  	<text class="concernNum">{{concernInfo.admireNums?concernInfo.admireNums:0}}</text>
				  	<text class="concernText">关注</text>
				  </view>
			  </view>
			  <view class="introdction">
				  <text class="name">简介:</text>
				  <text class="value">签名是一种态度，让别人更好的认识你</text>
			  </view>
		  </view>
	  </view>
	  <view class="release_history">
		  <view class="title">
			  <text>TA的发布</text>
		  </view>
		  <view class="detail">
			  <view class="release-detail-content">
				  <view class="title">
					  <text>aaa</text>
				  </view>
				  <view class="image-group">
					  <image src="../../static/add.png"  mode="scaleToFill" class="invitation-pic"></image>
				  </view>
			  </view>
		  </view>
	  </view>
	  
	  <min-modal ref="modal">
		  <view>
			<view>确定取消关注TA吗？</view>
		  </view>
    </min-modal>
	</view>
</template>

<script>
	import getStorage from "../../utils/getStorage.js";
	import configUrl from "../../utils/config_utils.js"
	import minModal from '@/components/min-modal/min-modal'
	export default {
		data() { 
			return {
				titleHeight:0,
				requestUrl:configUrl.imagesUrl,
				userInfo:{},
				title:"",
				fromUserId:"",
				isConcernType:0,
				concernInfo:{}
			}
		},
		 components: {
			minModal
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
			this.findConcernState(userId,fromUserId);
			this.getConcernDetail(userId,fromUserId);
			this.fromUserId = fromUserId;
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
			},
			goBack(){
				uni.navigateBack();
			},
			getConcernDetail(userId,fromUserId){
				this.$store.dispatch("getConcernDetail",{userId,toUserId:fromUserId})
				.then(res=>{
					console.log(res);
					this.concernInfo = res;
				})
				.catch(e=>{
					console.log(e)
				})
			},
			gotoDetailMsg(nickName){
				let id = this.fromUserId;
				uni.navigateTo({
					url:"../chat/chat?fromUserId="+id+"&nickName="+nickName
				});
			},
			concern(type){
				let userid = getStorage("userId");
				let toUserId = this.fromUserId;
				if(type==1){
					this.$refs.modal.handleShow({
						title: '温馨提示',
						actions: [{
						  name: '取消',
						}, {
						  name: '确定'
						}, 
						],
						success: (res) => {
						  if (res.id==1) {
							this.$store.dispatch("concernActions",{userid,toUserId,type})
							.then(res=>{
								console.log(res)
								this.getConcernDetail(userid,toUserId);
								this.findConcernState(userid,toUserId);
							}).catch(e=>{
								console.log(e)
							})
						  }
						}
					  })
				}else{
					this.$store.dispatch("concernActions",{userid,toUserId,type})
					.then(res=>{
						console.log(res)
						this.getConcernDetail(userid,toUserId);
						this.findConcernState(userid,toUserId);
					}).catch(e=>{
						console.log(e)
					})
				}
			},
			findConcernState(userId,fromUserId){
				this.$store.dispatch("findConcernState",{userId,toUserId:fromUserId})
				.then(res=>{
					console.log(res)
					this.isConcernType = res;
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
		  position: relative;
		  z-index: 1000;
	  }
	  .title{
		  width:calc(100% - 60upx);
		  margin-left: -60upx;
		  height:60upx;
		  line-height: 60upx;
		  font-size: 33upx;
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
	  padding-bottom: 60upx;
	  border-bottom:1px solid #eaeaea;
	  .button-group{
	  			  display:flex;
	  			  flex-direction: column;
	  			  justify-content: space-around;
	  			  align-items: center;
	  			  position: absolute;
	  			  right: 10upx;
	  			  top:10upx;
				  .user-option{
					  background: #4c84f5;
					  width:190upx;
					  font-size: 26upx;
					  margin:10upx;
				  }
	  }
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
		  padding-left: 50upx;
		  padding-right:50upx;
		    .userCenter{
		  		  width:100%;
		  		  height:100upx;
		  		  display: flex;
		  		  flex-direction: row;
		  		  justify-content: flex-start;
		  		  align-items: center;
				  margin-bottom:10upx;
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
			  margin-bottom:10upx;
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
			  align-items: flex-start;
			  .name{
				  color:#CCC;
				  font-size: 30upx;
				  margin-right: 10upx;
			  }
			  .value{
				  width:calc(90% - 10upx);
				  color:#CCC;
				  font-size: 30upx;
				  word-break: break-all;
			  }
		  }
	  }
  }
  .release_history{
	  width:100%;
	  display: flex;
	  flex-direction: column;
	  .title{
		  width:100%;
		  height:100upx;
		  line-height: 100upx;
		  text-align: left;
		  padding-left: 50upx;
		  font-size: 36upx;
	  }
	  .detail{
		  width:100%;
		  padding: 20upx 50upx;
		  display: flex;
		  flex-direction: column;
		  .release-detail-content{
			  width:calc(100% - 100upx);
			  box-sizing: border-box;
			  border:1px solid #eaeaea;
			  padding:10upx;
			  .title{
				  width:100%;
				  height:100upx;
				  box-sizing: border-box;
				  word-break: break-all;
				  padding: 0;
				  text-align: left;
			  }
			  .image-group{
				  width:100%;
				  height:230upx;
				  display:flex;
				  flex-direction:row;
				  justify-content:flex-start;
				  align-items:center;
				  .invitation-pic{
					  width:230upx;
					  height: 230upx;
				  }
			  }
		  }
	  }
  }
</style>
