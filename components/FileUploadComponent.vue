<template> 
	<view class="contain"> 
		<view class="upload-container" @tap="uploadImg">   
		    <view v-if="!imgSrc.length>0" class="detail-content">    
				<!-- <uni-icon color="#68bd91" type="camera" size="60"></uni-icon> -->
				<image :src="imgUrl1" class="image-big-1"></image>
				<text class="upload-name">添加图片</text>  
			</view>  
			<view v-if="imgSrc.length>0" class="picture_container">
				 <view class="img-container" v-for="(item,idx) in imgSrc" :key='idx'>  
					 <text class="close-btn" @tap.stop="deleteUpload(0,idx)">x</text>
					<image class="controls-play img" :src="uploadUrl+item"></image>  
				</view>		
			</view> 
		</view>
		<view class="upload-container"  @tap="uploadVideo">     
		    <view v-if="!videoSrc.length>0" class="detail-content">
				<!-- <uni-icon color="#68bd91" type="videocam" size="60"></uni-icon>  -->
				<image :src="imgUrl2" class="image-big-2"></image>
				<text class="upload-name">添加视频</text> 
			</view>
			<view v-if="videoSrc.length>0" class="picture_container"> 
				<view class="play-container">  
					<text class="close-btn" @tap.stop="deleteUpload(1,idx)">x</text>
					<video class="controls-play play" :src="uploadUrl+videoSrc"></video>  
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
		props: ["imgUrl1", "imgUrl2"
		],
		data() {
			return { 
				imgSrc:[],
				videoSrc:"",
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
						uni.uploadFile({          
							url: urlConfig.requestUrl+`/app/operation/${userId}/housing-resource/0/upload`, 
							filePath: res.tempFilePaths[0],  
							header:{
								'Authorization': jwt
							},
							name: 'fileResource',  
							success: (uploadFileRes) => {    
								console.log(uploadFileRes.data);
								if(uploadFileRes.statusCode == 200){  
									let data = JSON.parse(uploadFileRes.data);
									self.imgSrc.push(data.resourceUrl);
									console.log(self.imgSrc)
									self.$emit("setResourceUrl",{ 
										src:self.imgSrc,
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
			    }); 
			},
			deleteUpload(type,index){
				if(type===0){
					this.imgSrc.splice(index,1); 
					this.$emit("setResourceUrl",{ 
						src:this.imgSrc,
						type:0
					});
					return;
				}
				this.videoSrc.splice(index,1);
				this.$emit("setResourceUrl",{ 
					src:this.videoSrc,
					type:1
				});
			},
			uploadVideo(){ 
				var self = this; 
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
								let data = JSON.parse(uploadFileRes.data);
								self.videoSrc=data.resourceUrl;
								console.log(self.videoSrc)
								self.$emit("setResourceUrl",{ 
									src:self.videoSrc,
									type:1
								});
								
							}
						}
					}); 
			    }
			    });
			}
		} 
	}
</script>

<style lang="scss">
	.contain{  
		width:90vw;
		height: 330upx;  
		margin:30upx auto;
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
		position: relative;
		overflow-y:auto;
	}
	.easy_icon{ 
		position: absolute;
		left:43%;
		bottom: 0;
	} 
	.sepLine{
		width:1px;
		height:330upx;
		background-color: $uni-app-border-color;
		position: absolute;
		right: 0;
		top:15upx;
	}
	.img-container{
		width:100%;
		height:50%;
		position:relative;
	}
	.play-container{
		width:100%;
		height:100%;
		position:relative;
	}
	.img{
		
	}
	.close-btn{     
		position:absolute;
		right:3px;
		top:-6px;
		color:$uni-app-border-color;
	}
	.controls-play{ 
		width:100%;
		height:100%;
	}
	.play{
		height:100%;
	}
</style>
