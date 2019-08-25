<template> 
	<view class="contain"> 
		<view class="upload-container">   
		    <view v-if="!imgSrc.length>0" class="detail-content" @tap="uploadImg">    
				<!-- <uni-icon color="#68bd91" type="camera" size="60"></uni-icon> -->
				<image :src="imgUrl1" class="image-big-1"></image>
				<text class="upload-name">添加图片</text>  
			</view>  
			<view v-if="imgSrc.length>0" class="picture_container">
				<view class="sepLine"/> 
					<scroll-view scroll-y="true" class="scroll-Y"> 
						 <view class="img-container" v-for="(item,idx) in imgSrc" :key='idx'>  
							 <text class="close-btn" @tap="deleteUpload(0,idx)">x</text>
							<cover-image class="controls-play img" src="../../../static/play.png"></cover-image>  
						 </view>
					</scroll-view> 
			
			</view> 
		</view>
		<view class="upload-container">     
		    <view v-if="!videoSrc.length>0" class="detail-content"  @tap="uploadVideo">
				<!-- <uni-icon color="#68bd91" type="videocam" size="60"></uni-icon>  -->
				<image :src="imgUrl2" class="image-big-2"></image>
				<text class="upload-name">添加视频</text> 
			</view>
			<view v-if="videoSrc.length>0" class="picture_container"> 
				<view class="sepLine"/> 
					<scroll-view scroll-y="true" class="scroll-Y"> 
						 <view class="img-container" v-for="(item,idx) in videoSrc" :key='idx'>  
							 <text class="close-btn" @tap="deleteUpload(1,idx)">x</text>
							<video class="controls-play img" :src="item"></video>  
						 </view> 
					</scroll-view> 
			</view> 
		</view>  
	</view>
</template>

<script>
	import RestApi from "../utils/restApi/index.js";
	import urlConfig from '../utils/config_utils.js'
	console.log(urlConfig.requestUrl) 
	export default {
		props: ["imgUrl1", "imgUrl2"
		],
		data() {
			return { 
				imgSrc:[],
				videoSrc:[]
			}; 
		},
		onLoad() {
		},
		methods:{ 
			uploadImg(){    
				var self = this; 
				uni.chooseImage({  
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], 
					success: function (res) {   
						console.log(res)
						uni.uploadFile({          
							url: urlConfig.requestUrl+'/app/operation/1/housing-resource/0/upload', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],  
							name: 'fileResource',  
							success: (uploadFileRes) => {    
								console.log(uploadFileRes.data);
								if(uploadFileRes.statusCode == 200){  
									let data = JSON.parse(uploadFileRes.data);
									self.imgSrc.push(data.resourceUrl);
									self.$emit("setResourceUrl",{ 
										src:self.imgSrc,
										type:0
									});
								}
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
				uni.chooseVideo({
			    count: 1,
			    sourceType: ['camera', 'album'],
			    success: function (res) { 
					uni.uploadFile({          
						url: urlConfig.requestUrl+'/app/invitation-manage/rent/housing-resource/1/upload', //仅为示例，非真实的接口地址
						filePath: res.tempFilePath,  
						name: 'fileResource',
						success: (uploadFileRes) => { 
							if(uploadFileRes.statusCode == 200){  
								let data = JSON.parse(uploadFileRes.data);
								this.videoSrc.push(data.resourceUrl);
								self.$emit("setResourceUrl",{ 
									src:this.videoSrc,
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
	.upload-container:first-child {            
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
	}
	.easy_icon{ 
		position: absolute;
		left:43%;
		bottom: 0;
	} 
	.scroll-Y{  
		width:100%;
		height: 85%;  
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
		height:160upx;
	}
</style>
