<template>
  <view class="container-poster">
  	<button style="color: white;background: linear-gradient(to left, #f58365, #ff188a);" @tap="openPost">打开海报</button>
  	<poster></poster>
  </view>
</template>

<script>
	import getStorage from "../../utils/getStorage.js"
	import configUrl from "../../utils/config_utils.js"
	import {getImageInfo} from "../../utils/config.js"
	import poster from '../../components/uni-poster/index.vue';
	export default {
		data() { 
			return {
				width:0,
				height:0,
				shareInfo:{},
				imageUrl:configUrl.imagesUrl,
				posterShow:false
			}
		},
		components: {
			
		},
		async onLoad(event) { 
			let _this = this;
			var query = uni.createSelectorQuery()
			let res = await this.requestCode();
			let codeUrl = await this.send_code(res.codeBase);
			let head = await getImageInfo(this.imageUrl+res.headUrl);
			let bg = await getImageInfo(this.imageUrl+res.backUrl);
			let shareInfo = {
				headerImg:head,
				qrcode:codeUrl,
				bgImg:bg
			}
			this.shareInfo = shareInfo;
			query.select('#canvasPoster').boundingClientRect((res) => {
			    // 返回值包括画布的实际宽高
				uni.getSystemInfo({
				  success (res) {
					  console.log(res)
				    // 通过像素比计算出画布的实际大小（330x490）是展示的出来的大小
				    _this.width = 330 * res.pixelRatio
				    _this.height = 490 * res.pixelRatio
					_this.drawImage(res,res)
				  }
				})
		    }).exec()
			
			// this.shareInfo = shareInfo
		},
		methods: {
			drawImage (canvasAttrs,systemInfo) {
			    let ctx = uni.createCanvasContext('canvasPoster', this)
			    let canvasW = canvasAttrs.width // 画布的真实宽度
			    let canvasH = canvasAttrs.height //画布的真实高度
			    // 头像和二维码大小都需要在规定大小的基础上放大像素比的比例后面都会 *this.systemInfo.pixelRatio
			    let headerW = 48 *systemInfo.pixelRatio
			    let headerX = (canvasW - headerW) / 2
			    let headerY = 40 * systemInfo.pixelRatio
			    let qrcodeW = 73 * systemInfo.pixelRatio
			    let qrcodeX = 216 * systemInfo.pixelRatio
			    let qrcodeY = 400 * systemInfo.pixelRatio
			    // 填充背景
			    ctx.drawImage(this.shareInfo.bgImg, 0, 0, canvasW, canvasH)
			    ctx.save()
			    // 控制头像为圆形
			    ctx.setStrokeStyle('rgba(0,0,0,.2)') //设置线条颜色，如果不设置默认是黑色，头像四周会出现黑边框
			    ctx.arc(headerX + headerW / 2, headerY + headerW / 2, headerW / 2, 0, 2 * Math.PI)
			    ctx.stroke()
			    //画完之后执行clip()方法，否则不会出现圆形效果
			    ctx.clip()
			    // 将头像画到画布上
			    ctx.drawImage(this.shareInfo.headerImg, headerX, headerY, headerW, headerW)
			    ctx.restore()
			    ctx.save()
			    // 绘制二维码
			    ctx.drawImage(this.shareInfo.qrcode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
			    ctx.save()
			    ctx.draw()
			    setTimeout(() => {
			      //下面的13以及减26推测是因为在写样式的时候写了固定的zoom: 50%而没有用像素比缩放导致的黑边，所以在生成时进行了适当的缩小生成，这个大家可以自行尝试
			      wx.canvasToTempFilePath({
			        canvasId: 'canvasPoster',
			        x: 13,
			        y: 13,
			        width: canvasW - 26,
			        height: canvasH - 26,
			        destWidth: canvasW - 26,
			        destHeight: canvasH - 26,
			        success: (res) => {
			          this.poster = res.tempFilePath
			        }
			      })
			    }, 200)
			  },
			  openPost(){
				  console.log("a")
			  	this.posterShow = true
			  },
			  async send_code(code){
			    /*code是指图片base64格式数据*/
			    //声明文件系统
			    const fs = wx.getFileSystemManager();
			    //随机定义路径名称
			    var times = new Date().getTime();
			    var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
			   
			    //将base64图片写入
				return new Promise((resolve,reject)=>{
					fs.writeFile({
					  filePath: codeimg,
					  data: code,
					  encoding: 'base64',
					  success: () => {
						  resolve(codeimg)
					  },
					  fail(e){
						  reject(e)
					  }
					});
				})
			  },
			  requestCode(){
				  let userId = getStorage("userId")
				  return new Promise((resolve,reject)=>{
					  this.$store.dispatch("getCodeAndBackImg",{
					  	path:"/pages/home_page",
					  	userId
					  }).then(res=>{
						  resolve(res);
					  }).catch(e=>{
						  reject(e)
					  });
				  })
			  },
			  previewImg () {
			    if (this.poster) {
			      //预览图片，预览后可长按保存或者分享给朋友
			      wx.previewImage({
			        urls: [this.poster]
			      })
			    }
			  },
			  savePoster () {
			    if (this.poster) {
			      wx.saveImageToPhotosAlbum({
			        filePath: this.poster,
			        success: (result) => {
			          wx.showToast({
			            title: '海报已保存，快去分享给好友吧。',
			            icon: 'none'
			          })
			        }
			      })
			    }
			  }
		}
	}
</script>

<style lang="scss">
	.container-poster{
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
		}
</style>
