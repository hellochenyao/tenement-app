<template>
	<view>
		<!-- 海报 -->
		<canvas v-if="show" canvas-id="zwyPoster" :style="{width:cansWidth,height:cansHeight+'px'}" class="isCan" @touchmove.stop.prevent=""></canvas>
		<view v-if="show" class="bg" @click="closeCans"></view>
		<view v-if="show" class="fixedBox">
			<view class="boxLeft"><button class="flexBtn btnLeft" hover-class="btnHover" @click="saveCans">保存</button></view>
			<view class="boxRight"><button class="flexBtn btnRight" hover-class="btnHover" @click="closeCans">关闭</button></view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import {getImageInfo,getSystem} from "../../utils/config.js"
	import getStorage from "../../utils/getStorage.js"
	import configUrl from "../../utils/config_utils.js"
	import info from "../../utils/info.js"
	export default {
		props:{
			title:"",
			content:"",
			avatar:"",
			location:"",
			gender:0,
			remark:""
		},
		data() {
			return {
				// 海报
				cansWidth:270, //海报宽度
				cansHeight:900 	,//海报高度
				imageUrl:configUrl.imagesUrl,
				show:false
				// 海报
			};
		},
		async created() {
			this.show = false;
			info.loading("正在生成中...");
			let interval = setTimeout(()=>{
				info.hideLoading()
				info.toast("加载超时,请重新尝试！")
				this.$emit("openPost",false)
				return;
			},15000); 
			let remark = "";
			if(this.remark){
				remark = this.remark.split(",");
			}
			let gender = this.gender==0?"男生":"女生";
			let location = this.location.split(',')[0];
			let content = this.changeStrToArray(this.content)
			this.ctx = uni.createCanvasContext('zwyPoster',this);
			//绘制海报底色为白色
			let systemInfo = await getSystem();
			let res = this.codeAndImgUrl;
			this.cansWidth = systemInfo.screenWidth*0.9;
			this.cansHeight = uni.upx2px(1000)
			let codeUrl = await this.send_code(res.codeBase);
			let head = await getImageInfo(this.imageUrl+res.headUrl);
			let bg = await getImageInfo(this.imageUrl+res.backUrl);
			this.drawBaseBg('white');
			/*
				绘制图片
				调用方式:this.drawBg({
					url:'',路径
					sLeft:0~1 | 'center' 百分比离左边距离 1则为100vw,
					sTop:0~1 百分比离顶部距离,
					sWidth:0~1 百分比宽度，
					sHeight:0~1 百分比高度 
				})
			*/	
			this.drawBg({url:bg,sLeft:0,sTop:0,sWidth:1,sHeight:0.75})
			this.drawBg({url:codeUrl,sLeft:.05,sTop:0.77,sWidth:.30,sHeight:0.2})
			/*
				绘制头像
				绘制头像需要添加域名白名单	downloadFile合法域名	https://wx.qlogo.cn
				调用方式:this.circleImg(img, x, y, r) 
				img:图片路径
				x:0~1 百分比离左边距离,
				y:0~1 百分比离顶部距离
			*/
			this.circleImg(this.avatar,.1,.57, 12)
			/*
				绘制单行文本
				调用方式:this.drawText({
					text:'文本', String || Array
					sLeft:0~1 || 'center' 百分比离左边距离,
					sTop:0~1 百分比离顶部距离,
					fontSize:Number 文字大小,
					color:'' 颜色,
					bold:Boolean 粗体,
					lineHeight:Number //如果是数组则设置行高
				})
			*/	 
		    if(remark){
				this.drawText({text:remark,sLeft:.7,sTop:0.60,fontSize:10,color:'#FFF',lineHeight:20})
			}
			this.drawText({text:["一个想在",location,"租房的"+gender],sLeft:.3,sTop:0.60,fontSize:10,color:'#5A390F',bold:true,lineHeight:15})
			this.drawText({text:content,sLeft:.57,sTop:this.calTop(content.length),fontSize:13,color:'#5A390F',lineHeight:13})
			info.hideLoading();
			clearTimeout(interval);
			this.show = true;
		},
		destroyed(){
			console.log("a")
			this.clearWriteFile()
		},
		computed:{
			...mapState({
				codeAndImgUrl:state=>state.invitateStore.codeAndImgUrl
			}),
		},
		methods:{
			drawBaseBg(bgColor){
				this.ctx.rect(0, 0, this.cansWidth, this.cansHeight)
				this.ctx.setFillStyle(bgColor)
				this.ctx.fill()
				this.ctx.draw(true)
			},
			clearWriteFile(){
				uni.getFileSystemManager().getSavedFileList({  // 获取文件列表
					success (res) {
						console.log(res)
					  res.fileList.forEach((val, key) => { // 遍历文件列表里的数据
				        // 删除存储的垃圾数据
					    uni.removeSavedFile({
					        filePath: val.filePath
					    });
					  })
					}
				})
			},
			changeStrToArray(str){
				console.log(str)
				let changedArr = [];
				let newStr="";
				if(str.length<15){
					changedArr.push(str);
					return changedArr
				}
				for(var i =0;i<str.length;i++){
					newStr += str.split('')[i];
					if(newStr.length%15==0&&i>0){
						changedArr.push(newStr);
						newStr=""
					}
					if(changedArr.length>=5){
						changedArr.push("............")
						break;
					}
				}
				return changedArr
			},
			calTop(len){
				switch(len){
					case 1:
					return 0.855;
					case 2: 
					return 0.845;
					case 3:
					return 0.840;
					case 4:
					return 0.835;
					case 5:
					return 0.830;
					case 6:
					return 0.810;
				}
			},
			circleImg(img, x, y, r) {
				uni.getImageInfo({
					src:img
				}).then((image)=>{
					console.log(image[1].path)
					x= Math.ceil(this.cansWidth * x)
					y = Math.ceil(this.cansHeight * y)
					this.ctx.save();
					var d = 2 * r;
					var cx = x + 2*r;
					var cy = y + 2*r;
					this.ctx.strokeStyle="#000000"
					this.ctx.arc(cx, cy, 2*r, 0, 2 * Math.PI);
					this.ctx.stroke()
					this.ctx.clip();
					this.ctx.drawImage(image[1].path, x, y, d*2, d*2);
					this.ctx.restore();
					this.ctx.draw(true);
				})
			},
			closeCans() {
				this.$parent.posterShow = false
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
						info.hideLoading();
						info.toast("请清除缓存再次尝试，如有疑问，请联系客服！")
					}
				});
			   })
			},
			saveCans(){
				console.log('保存')
				uni.showLoading({
					title:'保存ing...',
					mask:true
				})
				uni.canvasToTempFilePath({
				  x: 0,
				  y: 0,
				  width: this.cansWidth*1.5,
				  height: this.cansHeight * 1.5,
				  destWidth: this.cansWidth * 3,
				  destHeight: this.cansHeight * 3,
				  canvasId:'zwyPoster',
				  success: function(res) {
					uni.hideLoading()
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function (res) {
							uni.showToast({
								title:'保存相册成功'
							})
							console.log('save success')
						},
					  fail(res) {
						console.log(res)
						if(res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
							uni.showModal({
								title:'您需要授权相册权限',
								success(res) {
									if(res.confirm){
										uni.openSetting({
											success(res) {
											
											},
											fail(res) {
												console.log(res)
											}
										})
									}
								}
							})
						}
					  }
					});
				  },
				  fail(res) {
					  uni.hideLoading()
				  }
				},this)
			},
			// requestCode(){
			// 	let userId = getStorage("userId")
			// 	let invitationId = this.id;
			// 	return new Promise((resolve,reject)=>{
			// 		this.$store.dispatch("getCodeAndBackImg",{
			// 			path:"/pages/home_page/content/index?id="+invitationId,
			// 			userId
			// 		}).then(res=>{
			// 			resolve(res);
			// 		}).catch(e=>{
			// 			reject(e)
			// 			info.hideLoading();
			// 		    info.toast(e.msg)
			// 		});
			// 	})
			// },
			drawPara(item){
				var redIndexObj = {}
				if(item.redWord.length > 0){
					for(var i = 0; i < item.redWord.length ;i++){
						let startIndex = 0,index;
						 while ((index = item.para.indexOf(item.redWord[i], startIndex)) > -1) {
						        redIndexObj[index] = true;
						        for(var j = 0;j<item.redWord[i].length; j++){
									redIndexObj[index+j] = true
								}
								startIndex = index + 1;
						 }
					}
				}
				this.ctx.font =`normal normal ${item.fontSize}px sans-serif`;
				this.ctx.setFillStyle(item.color)
				var isLeft 
				if(item.sLeft == 'center'){
					isLeft = this.cansWidth * (.5 - item.sMaxWidth /2) - item.fontSize
				} else {
					isLeft =  item.sLeft * this.cansWidth
				}
				var maxWidth = Math.floor(this.cansWidth * item.sMaxWidth)
				var tempList = item.para.split('')
				var nowText = '',
				isCol = 0,
				textWidth = 0
				for(var i = 0 ; i <tempList.length;i++){
					if(i>0){
						nowText += tempList[i -1]
					}  else {
						nowText += tempList[0]
					}
					textWidth = this.ctx.measureText(nowText).width
					if(textWidth > maxWidth){
						isCol++
						nowText = '占'
						textWidth = this.ctx.measureText(nowText).width
					}
					if(redIndexObj[i]){
						this.ctx.save()
						if(item.bold) this.ctx.font =`normal bold ${item.fontSize}px sans-serif`;
						this.ctx.setFillStyle(item.redColor)
					}
					this.ctx.fillText(tempList[i],isLeft+textWidth, item.sTop * this.cansHeight + item.titleHeight * isCol)
					this.ctx.restore()
				}
				this.ctx.draw(true)
			},
			drawBg(item){
				if(item.sLeft == 'center'){
				this.ctx.drawImage(item.url, this.cansWidth * (.5 - item.sWidth /2) , this.cansHeight * item.sTop, this.cansWidth * item.sWidth, this.cansHeight * item.sHeight);
				} else {
				this.ctx.drawImage(item.url, this.cansWidth * item.sLeft, this.cansHeight * item.sTop, this.cansWidth * item.sWidth, this.cansHeight * item.sHeight);
				}
				this.ctx.draw(true);
			},
			drawText(item){
				var isLeft
				if(item.sLeft == 'center'){
					isLeft = this.cansWidth * .5 - (item.fontSize*item.text.length) /2
				} else {
					isLeft =  item.sLeft * this.cansWidth
				}
				this.ctx.save()
				if(item.bold) this.ctx.font =`normal bold ${item.fontSize}px sans-serif`;
				this.ctx.setFillStyle(item.color)
				this.ctx.setFontSize(item.fontSize)
				if(item.text instanceof Array){
					if(!item.lineHeight) item.lineHeight = item.fontSize + 2
					console.log('我是数组',item.text)
					for(var i = 0 ; i < item.text.length ; i++){
						this.ctx.fillText(item.text[i],isLeft, item.sTop * this.cansHeight + item.lineHeight * i)
					}
				} else{
					console.log('我是字符串',item.text)
					this.ctx.fillText(item.text,isLeft, item.sTop * this.cansHeight)
				}
				this.ctx.draw(true)
				this.ctx.restore()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0upx;
		z-index: 100000;
		background-color: rgba(0, 0, 0, 0.8);
	}
	.fixedBox{
		width: 100%;
		height: 100upx;
		position: fixed;
		bottom: 30upx;
		left: 0;
		display: flex;
		z-index: 100001;
		.boxLeft,.boxRight{
			width: 50%;
			height: 100%;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1000;
			justify-content: center;
			.flexBtn{
				position: relative;
				z-index: 1000;
				width: 200upx;
				height: 60upx;
				text-align: center;
				line-height: 60upx;
				font-size: 24upx;
				border-radius: 32upx;
				color: white;
				background: linear-gradient(to left, #f58365, #ff188a);
			}
		}
	}
	.btnHover{
		height: 55upx !important;
		border-bottom: 0 #F6BE3C solid !important;
		transform: translateY(3px) translateZ(0px) !important;
	}
	.isCan{
		position: fixed;
		left: 0;
		z-index: 100001;
		width: 90%;
		height:700upx;
		right: 0;
		top: 30upx;
		margin:0 auto;
		background-size: 100%;
		box-sizing: content-box;
	}
</style>
