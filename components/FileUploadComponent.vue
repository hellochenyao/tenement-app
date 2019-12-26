<template> 
	<view class="contain"> 
		<view class="upload-container" @tap="uploadImg">   
		    <view v-if="!imgSrc.length>0" class="detail-content">    
				<!-- <uni-icon color="#68bd91" type="camera" size="60"></uni-icon> -->
				<image :src="'../static/images/add/xiangji.png'" class="image-big-1"></image>
				<text class="upload-name">添加图片</text>  
			</view>  
			<view v-if="imgSrc.length>0" class="picture_container">
				 <view class="img-container" v-for="(item,idx) in imgSrc" :key='idx'>
					 <view class="content-close" @tap.stop="deleteUpload(0,idx)">
						<image class="close-btn" src="../static/images/page/close.png"></image>
					 </view>
				     <image class="controls-play img" :src="item" mode="scaleToFill"></image>
					 <image class="img_desc" src="../static/images/home_page/img.png"></image>
				</view>		
			</view> 
		</view>
		<view class="upload-container"  @tap="uploadVideo">      
		    <view v-if="!videoSrc" class="detail-content">
				<!-- <uni-icon color="#68bd91" type="videocam" size="60"></uni-icon>  -->
				<image :src="'../static/images/add/shiping.png'" class="image-big-2"></image>
				<text class="upload-name">添加视频</text> 
			</view>
			<view v-if="videoSrc" class="picture_container"> 
				<view class="play-container">  
					<view class="content-close" @tap.stop="deleteUpload(1,idx)">
						<image class="close-btn" src="../static/images/page/close.png"></image>
					</view>
					<video class="controls-play play" :src="videoSrc"></video>  
					<image class="video_desc" src="../static/images/home_page/video.png"></image>
				 </view> 
			</view> 
		</view>  
	</view>
</template>

<script>
	import RestApi from "../utils/restApi/index.js";
	import urlConfig from '../utils/config_utils.js'
	import getStorage from '../utils/getStorage.js';
	import info from "../utils/info";
	export default {
		props: ["imgArr","video"
		],
		data() {
			return { 
				imgSrc:[],
				videoSrc:"",
				imgData:[],
				videoData:"",
				uploadUrl:urlConfig.uploadFileUrl
			}; 
		},
		onLoad() {
		},
		methods:{ 
			uploadImg(){ 
				let userId = getStorage("userId");
				let userJWTandToken = uni.getStorageSync("userJWTandToken");
				let jwt = userJWTandToken.split('/')[0];
				var self = this; 
				uni.chooseImage({  
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], 
					success: function (res) {   
						console.log(res)
						for(var i =0;i<res.tempFilePaths.length;i++){
							console.log(res.tempFilePaths[i])
						    let img = res.tempFilePaths[i];
							uni.uploadFile({
								url: urlConfig.requestUrl+`/app/operation/${userId}/housing-resource/0/upload`, 
								filePath: res.tempFilePaths[i],  
								header:{
									'Authorization': jwt
								},
								name: 'fileResource',  
								success: (uploadFileRes) => {    
									if(uploadFileRes.statusCode == 200){  
										let data = JSON.parse(uploadFileRes.data);
										self.imgSrc.push(img);
										self.imgData.push(data.resourceUrl)
										self.$emit("setResourceUrl",{ 
											src:self.imgData,
											type:0
										});
									}
								},
								fail:(e)=>{
									console.log(e)
									info.toast("删除成功！");
								}
							}); 
						}
					}
			    }); 
			},
			deleteUpload(type,index){
				console.log(type)
				if(type===0){
					this.imgSrc.splice(index,1); 
					this.imgData.splice(index,1);
					this.$emit("setResourceUrl",{ 
						src:this.imgData,
						type:0
					});
					return;
				}
				this.videoSrc="";
				this.videoData="";
				this.$emit("setResourceUrl",{ 
					src:this.videoData,
					type:1
				});
			},
			uploadVideo(){ 
				var self = this; 
				if(this.videoSrc){
					return;
				}
				let userJWTandToken = uni.getStorageSync("userJWTandToken");
				let jwt = userJWTandToken.split('/')[0];
				let userId = getStorage("userId");
				uni.chooseVideo({
			    count: 1,
			    sourceType: ['camera', 'album'],
			    success: function (res) { 
					uni.uploadFile({          
						url: urlConfig.requestUrl+`/app/operation/${userId}/housing-resource/1/upload`, //仅为示例，非真实的接口地址
						filePath: res.tempFilePath,  
						name: 'fileResource',
						header:{ 
							'Authorization': jwt
						},
						success: (uploadFileRes) => { 
							if(uploadFileRes.statusCode == 200){  
								console.log(res)
								let data = JSON.parse(uploadFileRes.data);
								self.videoSrc=res.tempFilePath;
							    self.videoData = data.resourceUrl;
								console.log(self.videoData)
								self.$emit("setResourceUrl",{ 
									src:self.videoData,
									type:1
								});
								 
							}
						}
					}); 
			    }
			    });
			}
		},
		watch:{
			imgArr(v){
				this.imgSrc=v.map(ite=>{
					return this.uploadUrl+ite;
				})
			},
			video(v){
				this.videoSrc=this.uploadUrl+v
			}
		}
	}
</script>

<style lang="scss">
	.contain{  
		width:90vw;
		height: 330upx;
		margin:15upx auto; 
		overflow: hidden;
		display: flex;
		flex-direction: row; 
		border-radius: 10upx;
		box-shadow: 1px 1px 5px #d6d6d6;
	}
	.image-big-1{
		width: 110upx;
		height: 90upx;
		margin-bottom: 10upx;
	}
	.image-big-2{
		width: 115upx;
		height: 95upx;
		margin-bottom: 10upx;
	}
	.upload-container{      
		width:50%;
		height:330upx;
		overflow: hidden;
		padding:0 1upx 0 1upx;
		border-radius: 10upx;
		background-color: #FFFFFF;
	}
	.detail-content{   
		width:100%;
		height:315upx;
		margin-top: 15upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.detail-content:active{ 
		opacity: 0.7;
	}
	.upload-container:first-of-type {            
		border-right: 1px solid $uni-app-border-color;
	}
	.upload-name{  
		font-size: $uni-font-size-base;
		color:$uni-app-font-color;
	}
	.picture_container{    
		width:100%;
		height:100%;
		border-radius: 10upx;
		overflow: hidden;
		overflow-y:auto;
	}
	.img-container{
		width:100%;
		height:50%;
		position:relative;
		.img_desc{
			width:50upx;
			height:50upx;
			position: absolute;
			right:0;
			bottom:0;
			z-index:1000;
		}
	}
	.play-container{
		width:100%;
		height:100%;
		position:relative;
		.video_desc{
			width:50upx;
			height:50upx;
			position: absolute;
			right:0;
			bottom:0;
			z-index:1000;
		}
	}
	.img{
		
	}
	.content-close{
		position:absolute;
		width:50upx;
		height:50upx;
		font-size: 50upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-bottom-left-radius: 30upx;
		right:3px;
		top:0upx;
		background: #666;
		z-index: 1000;
		.close-btn{
			width:70%;
			height:36upx;
		}
	}
	.controls-play{ 
		width:100%;
		height:100%;
	}
	.play{
		height:100%;
	}
</style>
