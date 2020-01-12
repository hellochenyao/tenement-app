<template>
	<view class="page" @touchstart="touchStart" @touchend="touchEnd">
		<form>
			<view class="uni-textarea">
				<textarea placeholder="这一刻的想法..." v-model="input_content" />
				</view>
			<view class="feedback-body feedback-uploader">
			    <view class="uni-uploader">
			        <view class="uni-uploader-head">
			            <view class="uni-uploader-title">点击预览图片</view>
			            <view class="uni-uploader-info">{{imageList.length}}/8</view>
			        </view>
			        <view class="uni-uploader-body">
			            <view class="uni-uploader__files">
			                <block v-for="(image,index) in imageList" :key="index">
			                    <view class="uni-uploader__file" style="position: relative;">
			                        <image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
			                        <view class="close-view" @click="close(index)">x</view>
			                    </view>
			                </block>
			                <view class="uni-uploader__input-box" v-show="imageList.length < 8">
			                	<view class="uni-uploader__input" @tap="chooseImg"></view>
			                </view>
			            </view>
			        </view>
			    </view>
			</view>
			
			<view class="footer">
				<button type="default" class="feedback-submit" @click="send()">发布</button>
			</view>
		</form>
	</view>
</template>

<script> 
	import getStorage from "../../../utils/getStorage.js"
	import urlConfig from "../../../utils/config_utils.js"
	import image from '@/common/image.js';
	
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				// title: 'choose/previewImage',
				input_content:'',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				
				//侧滑返回start
				startX: 0, //点击屏幕起始位置
				movedX: 0, //横向移动的距离
				endX: 0, //接触屏幕后移开时的位置
				//end
				images:[]
			}
		},
		onUnload() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		
		methods: {
			getLocation(){//h5中可能不支持,自己选择
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							resolve(res);
						},
						fail: (e) => {  
							reject(e);
						}
					});
				} )
			},
			
			close(e){
			    this.imageList.splice(e,1);
			},
			chooseImg() { //选择图片
			    let userId = getStorage("userId");
			    let userJWTandToken = uni.getStorageSync("userJWTandToken");
			 	let jwt = userJWTandToken.split('/')[0];
			    uni.chooseImage({
			        sourceType: ["camera", "album"],
			        sizeType: "compressed",
			        count: 8 - this.imageList.length,
			        success: (res) => {
						console.log(res)
						for(var i =0;i<res.tempFilePaths.length;i++){
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
										let i = JSON.parse(uploadFileRes.data);
										this.imageList = this.imageList.concat(img);
										this.images = this.images.concat(i.resourceUrl);
									}
								},
								fail:(e)=>{
									console.log(e)
									info.toast(e.msg);
								}
							}); 
						}
			        }
			    }) 
			},
			previewImage() { //预览图片
			    uni.previewImage({
			        urls: this.imageList
			    });
			},   
			send() { //发送反馈 
			    let userId = getStorage("userId");
				uni.showLoading({title:'发布中'});
			    this.$store.dispatch("sendDynamic",{
					image:this.images.toString(),
					circleId:1,
					circleName:"USER",
					content:this.input_content,
					userId
				}).then(res=>{
					console.log(res) 
					uni.hideLoading();
					uni.showToast({
						icon:'success',
						title:"发布成功"
					})
					uni.switchTab({
					    url: '../index/index?refresh='+true
					});
				})
				.catch(e=>{ 
					console.log(e)
				});
			},
			touchStart: function(e) {
				this.startX = e.mp.changedTouches[0].pageX;
			},
			
			touchEnd: function(e) {
				this.endX = e.mp.changedTouches[0].pageX;
				if (this.endX - this.startX > 200) {
					uni.navigateBack();
				}
			}
		}
	}
</script>

<style scoped>
	@import url("../../../common/index/index.css");
	.footer {
		margin-top: 80upx;
	}
	
	.cell-pd {
		padding: 20upx 30upx;
	}

	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 150upx;
	}
	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
	}
	.close-view{
	    text-align: center;
		line-height:30upx;
		height: 35upx;
		width: 35upx;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 1upx;
		right: 1upx;
		font-size: 35upx;
		border-radius: 8upx;
	}
	.page {
		width: 750upx;
		height: 100%;
	}
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
	}
	page {
	    background-color: #EFEFF4;
	}
	view{
	    font-size: 28upx;
	}
	.input-view {
	    font-size: 28upx;
	}
	.close-view{
	    text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
	}
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}
	.uni-uploader-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.uni-uploader-info {
		color: #B2B2B2;
	}
	.uni-uploader-body {
		margin-top: 16upx;
	}
	.uni-uploader__files {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.uni-uploader__file {
		margin: 10upx;
		width: 210upx;
		height: 210upx;
	}
	.uni-uploader__img {
		display: block;
		width: 210upx;
		height: 210upx;
	}
	.uni-uploader__input-box {
		position: relative;
		margin:10upx;
		width: 208upx;
		height: 208upx;
		border: 2upx solid #D9D9D9;
	}
	.uni-uploader__input-box:before,
	.uni-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	.uni-uploader__input-box:before {
		width: 4upx;
		height: 79upx;
	}
	.uni-uploader__input-box:after {
		width: 79upx;
		height: 4upx;
	}
	.uni-uploader__input-box:active {
		border-color: #999999;
	}
	.uni-uploader__input-box:active:before,
	.uni-uploader__input-box:active:after {
		background-color: #999999;
	}
	.uni-uploader__input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	
	/*问题反馈*/
	.feedback-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		color: #8f8f94;
		font-size: 28upx;
	}
	.feedback-star-view.feedback-title {
		justify-content: flex-start;
		margin: 0;
	}
	.feedback-quick {
		position: relative;
		padding-right: 40upx;
	}
	.feedback-quick:after {
		font-family: uniicons;
		font-size: 40upx;
		content: '\e581';
		position: absolute;
		right: 0;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}
	.feedback-body {
		background: #fff;
	}
	.feedback-textare {
		height: 200upx;
		font-size: 34upx;
		line-height: 50upx;
		width: 100%;
		box-sizing: border-box;
		padding: 20upx 30upx 0;
	}
	.feedback-input {
		font-size: 34upx;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 20upx;
		line-height: 50upx;
	}
	.feedback-uploader {
		padding: 22upx 20upx;
	}
	.feedback-star {
		font-family: uniicons;
		font-size: 40upx;
		margin-left: 6upx;
	}
	.feedback-star-view {
		margin-left: 20upx;
	}
	.feedback-star:after {
		content: '\e408';
	}
	.feedback-star.active {
		color: #FFB400;
	}
	.feedback-star.active:after {
		content: '\e438';
	}
	.feedback-submit {
		background: #59c298;
		color: #FFFFFF;
		margin: 20upx;
	}
</style>
