<template>
	<view>
	        <view class="uni-padding-wrap uni-common-mt">
	            <view class="video-content" v-if="!imgVideoUrl.video">
	                <video id="myVideo" class="imgVideo" src="https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
	                    @error="videoErrorCallback" :danmu-list="danMu" enable-danmu danmu-btn controls @timeupdate="timeChange"></video>
	            </view>
	            <view class="dm-list" v-if="!imgVideoUrl.video">
	                <input v-model="danmuValue" class="dm-input" type="text" placeholder="在此处输入弹幕内容,可让他人看到你的想法" />
					<image class="send" mode="widthFix" src="../../../static/images/home_page/send.png" @tap="sendDanmu"></image> 
	            </view>
				<image :src="item.url" :width="item.width" :height="item.height" v-for="(item,index) in imgVideoUrl" :key="index" mode="widthFix" class="image" @tap="reviewImg"></image>
	        </view>
	    </view>
</template>

<script>
	import { mapState,mapActions,mapGetters } from 'vuex'
	import getStorage from "../../../utils/getStorage.js"
	export default {
	    data() {
	        return {
	            src: '',
	            danmuList: [
	            ],
	            danmuValue: '',
				invitationId:"",
				userMsgs:[],
				responseUserId:"",
				time:0
	        }
	    },
	    onReady: function(res) {
	        // #ifndef MP-ALIPAY
	        this.videoContext = uni.createVideoContext('myVideo')
	        // #endif
	    },
		onLoad(event) {
			let invitationId = event.id
			let responseUserId = event.responseUserId
			this.invitationId = invitationId;
			this.responseUserId = responseUserId;
			this.getUserMsgs(invitationId)
		},
		computed:{
			...mapState({ 
				imgVideoUrl:state=>{
					let imgArr = state.invitateStore.imgVideoUrl.image
					let imgs = imgArr.map(v=>{
						let img = {};
						img["url"] = v;
						uni.getImageInfo({
						    src: v,
						    success: function (image) {
								img["width"] = image.width
								img["height"] = image.height
						        console.log(image.width);
						        console.log(image.height);
						    }
						});
						return img
					})
				    return imgs;
				}
			}),
			danMu(){
				let data = this.userMsgs.map((v,i)=>{
					let danObj = {};
					danObj["text"] = v.msg;
					danObj["color"] = this.getRandomColor();
					danObj["time"] = v.time?v.time:i/2
					return danObj
				})
				return data
			}
		},  
	    methods: {
	        sendDanmu: function() {
	            this.videoContext.sendDanmu({
	                text: this.danmuValue,
	                color: this.getRandomColor()
	            });
				this.sendMsg(this.danmuValue)
	        },
	        videoErrorCallback: function(e) {
	            uni.showModal({
	                content: e.target.errMsg,
	                showCancel: false
	            })
	        },
			timeChange(event){
				this.time = event.detail.currentTime
			},
			sendMsg(msg){
				let userId = getStorage('userId');
				let postData = {
					answerMsgId:0,
					msg:msg,
					invitationId:this.invitationId,
					responseUserId:this.responseUserId,
					userId,
					time:this.time
				}
				this.$store.dispatch("responseMsg",postData)
				.then(res=>{
				    this.danmuValue = '';
				})
				.catch(e=>{
					console.log(e)
				})
			},
			getUserMsgs(invitationid){
				let userId = getStorage('userId');
				let postData = {
					userId,
					invitationid
				}
				this.$store.dispatch("getUserMsgs",postData)
				.then(res=>{
					this.userMsgs = res.data;
				})
				.catch(e=>{
					console.log(e)
				})
			},
	        getRandomColor: function() {
	            const rgb = []
	            for (let i = 0; i < 3; ++i) {
	                let color = Math.floor(Math.random() * 256).toString(16)
	                color = color.length == 1 ? '0' + color : color
	                rgb.push(color)
	            }
	            return '#' + rgb.join('')
	        },
			reviewImg(){
				 uni.previewImage({
				    urls: this.imgVideoUrl.map(v=>v.url),
				 });
			}
	    }
	}
</script>

<style lang="scss">
	.uni-common-mt{
		width:100%;
		.video-content{
			width:100%;
			.imgVideo{
				width:100%;
			}
		}
	}
	.dm-list{
		width:97%;
		font-size: 26upx;
		margin:0 1.5%;
		height:70upx;
		line-height: 70upx;
		position: relative;
		border:1px solid #eaeaea;
		margin-bottom: 30upx;
		.dm-input{
			width:calc(100% - 40upx);
			height:70upx;
			line-height: 70upx;
			padding-left: 10upx;
		}
		.send{
			width:40upx;
			height:70upx;
			position: absolute;
			right:0;
			top:15upx;
			:active{
				opacity: 0.6;
			}
		}
	}
	.image{
		width:100%;
	}
</style>
