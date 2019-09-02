<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="!scrollAnimation&&!haveLoad">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="load" v-if="scrollAnimation&&haveLoad">
					<text class="text-value">没有更多了</text>
				</view>
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
					<!-- 系统消息 -->
					<block v-if="row.type=='system'" >
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.msg.type=='text'" class="text">
								{{row.msg.content.text}}
							</view>
							<!-- 领取红包消息 -->
							<view v-if="row.msg.type=='redEnvelope'" class="red-envelope">
								<image :src="imageUrl+'red-envelope-chat.png'"></image>
								{{row.msg.content.text}}
							</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<block v-if="row.type=='user'"> 
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.msg.userinfo.uid!=fromUserId">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble">
									<image src="../../static/images/private/sendError.png" class="sendError"  v-if="sendErrorTask[row.msg.id]" @tap="sendSocketMsgTwice(row.msg)"></image>
									<rich-text :nodes="row.msg.content.text"></rich-text>
								</view>
								<!-- 语言消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg,row.msg.content.type)" :class="playMsgid == row.msg.content.url?'play':''">
									<image src="../../static/images/private/sendError.png" class="sendError" v-if="sendErrorTask[row.msg.id]"  @tap="sendSocketMsgTwice(row.msg)"></image>
									<view class="length">{{playMsgid == row.msg.content.url?currentPlayDate:row.msg.content.length}}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg,row.msg.content.type)">
									<image src="../../static/images/private/sendError.png" class="sendError" v-if="sendErrorTask[row.msg.id]"  @tap="sendSocketMsgTwice(row.msg)"></image>
									<text v-if="uploadRateTask[row.msg.id]" class="back"></text>
									<text  v-if="uploadRateTask[row.msg.id]" class="currentUploading">{{uploadRateTask[row.msg.id]+'%'}}</text>
									<image :src="row.msg.content.type==0?imageUrl+row.msg.content.url:row.msg.content.url" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope" @tap="openRedEnvelope(row.msg,index)">
									<image src="../../static/images/private/sendError.png" v-if="sendErrorTask[row.msg.id]"  class="sendError" @tap="sendSocketMsgTwice(row.msg)"></image>
									<image :src="imageUrl+'red-envelope.png'"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
								
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.msg.userinfo.face"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.uid==fromUserId">
							<!-- 左-头像 -->
							<view class="left">
								<image :src="row.msg.userinfo.face"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{row.msg.userinfo.username}}</view> <view class="time">{{row.msg.time}}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble">
									<rich-text :nodes="row.msg.content.text"></rich-text>
								</view>
								<!-- 语音消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg,row.msg.content.type)" :class="playMsgid == row.msg.content.url?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{playMsgid == row.msg.content.url?currentPlayDate:row.msg.content.length}}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg,row.msg.content.type)">
									<text v-if="uploadRateTask[row.msg.id]" class="back"></text>
									<text  v-if="uploadRateTask[row.msg.id]" class="currentUploading">{{uploadRateTask[row.msg.id]+'%'}}</text>
									<image :src="row.msg.content.type==0?imageUrl+row.msg.content.url:row.msg.content.url" :style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"></image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope" @tap="openRedEnvelope(row.msg,index)">
									<image :src="imageUrl+'red-envelope.png'"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 --> 
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="imageUrl+'emoji/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
					<view class="box" @tap="handRedEnvelopes"><view class="icon hongbao"></view></view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode"  :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus"/>
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image :src="imageUrl+'im/face/face_1.jpg'"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>
<script>
	import configUrl from "../../utils/config_utils.js";
	import getStorage from "../../utils/getStorage.js"
	import {formatDate,format} from "../../utils/calDateDiff.js";
	import {emo,onlineEmoji} from "../../utils/config.js";
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				//文字消息
				textMsg:'',
				//消息列表
				isHistoryLoading:false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				msgImgList:[],
				myuid:0,
				
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
				
				//播放语音相关参数
				AUDIO:uni.createInnerAudioContext(),
				playMsgid:null,
				VoiceTimer:null,
				// 抽屉参数
				popupLayerClass:'',
				// more参数
				hideMore:true,
				//表情定义
				hideEmoji:true,
				emojiList:emo,
				//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
				onlineEmoji:onlineEmoji,
				//红包相关参数
				windowsState:'',
				redenvelopeData:{
					rid:null,	//红包ID
					from:null,
					face:null,
					blessing:null,
					money:null
				},
				imageUrl:configUrl.imagesUrl,
				fromUserId:"",
				pageNo:1,
				pageSize:10,
				total:0,
				haveLoad:false,
				currentPlayDate:"00:00",
				uploadRateTask:{},
				sendErrorTask:{}
			};
		},
		onLoad(option) {
			this.getMsgList(option.fromUserId);
			//语音自然播放结束
			this.AUDIO.onEnded((res)=>{
				this.playMsgid=null;
			});
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e)=>{
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e)=>{
				this.recordEnd(e);
			})
			// #endif
			if(option.fromUserId){
				this.fromUserId = option.fromUserId;
			}
			uni.setNavigationBarTitle({
			　　title:option.nickName
			})
			this.$store.dispatch("getUserInfo");
		},
		computed:{
			...mapState({ 
				socketOpen:state=>state.privateMsgStore.socketOpen,
				msgQueue:state=>state.privateMsgStore.msgQueue,
				refreshMsg:state=>{
					return state.privateMsgStore.refreshMsgList
				},
				userinfo:state=>{
					console.log(state)
					return state.loginStore.userinfo
			    },
				errorSendMsg:state=>state.privateMsgStore.errorSendMsg
			})
		}, 
		onShow(){
			// this.scrollTop = 9999999;
			// uni.getStorage({
			// 	key: 'redEnvelopeData',
			// 	success:  (res)=>{
			// 		let nowDate = new Date();
			// 		let lastid = this.msgList[this.msgList.length-1].msg.id;
			// 		lastid++;
			// 		let row = {type:"user",msg:{id:lastid,type:"redEnvelope",time:nowDate.getHours()+":"+nowDate.getMinutes(),userinfo:{uid:0,username:"大黑哥",face:"/images/app/face.jpg"},content:{blessing:res.data.blessing,rid:Math.floor(Math.random()*1000+1),isReceived:false}}};
			// 		this.screenMsg(row);
			// 		uni.removeStorage({key: 'redEnvelopeData'});
			// 	}
			// });
		},
		methods:{
			// 接受消息(筛选处理)
			screenMsg(msg){
				let userId = getStorage("userId");
				//从长连接处转发给这个方法，进行筛选处理
				console.log(msg)
				if(msg.type=='system'){
					// 系统消息
					switch (msg.msg.type){
						case 'text':
							this.addSystemTextMsg(msg);
							break;
						case 'redEnvelope':
							this.addSystemRedEnvelopeMsg(msg);
							break;
					}
				}else if(msg.type=='user'){
					// 用户消息
					switch (msg.msg.type){
						case 'text': 
							this.addTextMsg(msg);
							break;
						case 'voice':
							this.addVoiceMsg(msg);
							break;
						case 'img':
							this.addImgMsg(msg);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(msg);
							break;
					}
					//非自己的消息震动
					if(msg.msg.userinfo.uid!= userId){
						console.log('振动');
						uni.vibrateLong();
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+msg.msg.id
					console.log(msg.msg.id)
				});
			},
			connectSocket(data){
				let userId = getStorage('userId');
				let req={
					userId,
					data
				}
				this.$store.dispatch("connectWebSocketMsg",req);
			},
			//重新发送失败的消息
			sendSocketMsgTwice(msg){
				 console.log(msg)
				 let message = {
					 id:msg.id,
					 contentText:msg.content.text,
					 desc:msg.content.desc,
					 type:msg.type,
					 toUserId:this.fromUserId
				 }
				 this.sendSocketMsg(message);
			},
			sendSocketMsg(msg){
				let id = msg.id;
				let task = this.sendErrorTask;
				if (!this.socketOpen) {
					if(!task[id]){
						task[id] = true;
						this.sendErrorTask = Object.assign({},task);
					}
					this.connectSocket({msg});
				}
				let postData={msg:msg};
				this.$store.dispatch("sendSocketMsg",postData)
				.catch(e=>{
					if(e.errMsg=="sendSocketMessage:fail WebSocket is not connected"){
						this.$store.commit("setSocketOpen",false)
					}
				})
			},
			//触发滑动到顶部(加载历史信息记录)
			async loadHistory(e){
				if(this.isHistoryLoading){
					return ;
				}
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
		        this.scrollAnimation = false;
				let Viewid = this.msgList[0].msg.id;//记住第一个信息ID
				//本地模拟请求历史记录效果
				if(this.msgList.length==this.total){
					this.isHistoryLoading = false;
					this.scrollAnimation = true;
					this.haveLoad = true;
					return
				}
				let userId = getStorage("userId");
				// 消息列表
				let postData={
					userId,
					receiveUserid:this.fromUserId,
					pageNo:this.pageNo,
					pageSize:this.pageSize
				}
				let list= await this.requestMsg(postData);
					// 获取消息中的图片,并处理显示尺寸
				for(let i=0;i<list.length;i++){
					if(list[i].type=='user'&&list[i].msg.type=="img"){
						list[i].msg.content = this.setPicSize(list[i].msg.content);
						this.msgImgList.unshift({url:list[i].msg.content.url,type:0});
					}
					this.msgList.unshift(list[i]);
				} 
					
				//这段代码很重要，不然每次加载历史数据都会跳到顶部
				// this.$nextTick(function() {
				// 	console.log("a")
				// 	this.scrollToView = 'msg'+Viewid;//跳转上次的第一行信息位置
				// 	this.$nextTick(function() {
				// 		this.scrollAnimation = true;//恢复滚动动画
				// 	});
				// });
				this.scrollToView = 'msg'+Viewid;
				this.scrollAnimation = true;
				this.isHistoryLoading = false;
			},
			// 加载初始页面消息
		async getMsgList(fromUserId){
				let userId = getStorage("userId");
				// 消息列表
				let postData={
					userId,
					receiveUserid:fromUserId,
					pageNo:this.pageNo,
					pageSize:this.pageSize
				}
				let list = await this.requestMsg(postData);
					// 获取消息中的图片,并处理显示尺寸
			    for(let i=0;i<list.length;i++){
					if(list[i].type=='user'&&list[i].msg.type=="img"){
						list[i].msg.content = this.setPicSize(list[i].msg.content);
						this.msgImgList.push({url:list[i].msg.content.url,type:0});
					}
				}
				this.msgList = list.reverse();
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					//this.scrollTop = 9999;
					this.scrollToView = 'msg'+this.msgList[this.msgList.length-1].msg.id
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
					
				 });

			},
			requestMsg(postData){
				return new Promise((rev,rej)=>{

						this.$store.dispatch("findHistoryMsg",postData)
						.then(res=>{
							console.log(res)
							this.pageNo = this.pageNo+1;
							let {messages} = res;
							this.total = res.total;
							let lastid =this.msgList.length>0?this.msgList.length:1;
							 let list = messages.map(v=>{
								 console.log(lastid)
								 lastid++;
								let message={
										  type:"user",
										  msg:{
											  id:lastid,
											  type:v.type,
											  time:formatDate(v.createTime),
											  userinfo:{
												  uid:v.userid,
												  username:v.userNickName,
												  face:v.userAvatar
												  
											  },
											  content:{}
										  }
									  };
								switch(v.type){
									case "text":
									   message.msg["content"]["text"] = v.content;
									   break;
									case "img":
									   message.msg["content"]["url"] = JSON.parse(v.content).url;
									   message.msg["content"]["w"] = JSON.parse(v.content).w;
									   message.msg["content"]["h"] = JSON.parse(v.content).h;
									   message.msg["content"]["type"] = 0;
									   break;
									case "voice":
									   message.msg["content"]["url"] = JSON.parse(v.content).url;
									   message.msg["content"]["length"] = JSON.parse(v.content).length;
									   message.msg["content"]["type"] = 0;
									   break;
								}
								return message;
							});
							console.log(list)
							rev(list);
					})
					.catch(e=>{
						console.log(e)
						rej(e);
					})
	
				})
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
				let maxH = uni.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
			},
			
			//更多功能(点击+弹出) 
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				if(this.hideMore){
					this.hideMore = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
				uni.navigateTo({
					url:'hand/hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type){
				let userId = getStorage("userId");
				this.hideDrawer();
				let userJWTandToken = uni.getStorageSync("userJWTandToken");
				let jwt = userJWTandToken.split('/')[0];
				uni.chooseImage({
					sourceType:[type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=>{
						for(let i=0;i<res.tempFilePaths.length;i++){
							let uploadTask=[]
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image)=>{
									let msg = {url:res.tempFilePaths[i],w:image.width,h:image.height};
									let message = this.formatMessage(msg,"img");
									let msgid = message.msg.id;
									this.screenMsg(message);
									uploadTask[i] = uni.uploadFile({
										url: configUrl.requestUrl+`/app/tenement/${userId}/picture/message/upload/0`,
										filePath: res.tempFilePaths[i],
										name: 'fileResource',
										header:{
											'Authorization': jwt
										},
										formData: {
											'toUserid': this.fromUserId
										},
										success: (uploadFileRes) => {
											let imgstr = JSON.parse(uploadFileRes.data).resourceUrl
											msg["url"] = imgstr;
											this.sendMsg(msg,'img',msgid);
										},
										fail:(e)=>{
											console.log(e)
										}
									});
									uploadTask[i].onProgressUpdate((res) => {
										console.log('上传进度' + res.progress);
										console.log('已经上传的数据长度' + res.totalBytesSent);
										console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
										let uploadRateTask = this.uploadRateTask;
										let rat = res.progress;
										uploadRateTask[message.msg.id] = rat;
										let id = message.msg.id;
										if(rat>=100){
											delete uploadRateTask[id]
										}
										this.uploadRateTask = Object.assign({},uploadRateTask);
									});
							}
							});
						}
					}
				});
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em){
				this.textMsg+=em.alt;
			},
			
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText(){
				this.hideDrawer();//隐藏抽屉
				if(!this.textMsg){
					return;
				}
				console.log(this.textMsg)
				let content = this.replaceEmoji(this.textMsg);
				let message = this.formatMessage(content,"text");
				let msgid = message.msg.id;
				this.screenMsg(message);
				this.sendMsg(content,'text',msgid);
				this.textMsg = '';//清空输入框
			},
			//替换表情符号为图片
			replaceEmoji(str){
				let desc="";
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					console.log("item: " + item);
					for(let i=0;i<this.emojiList.length;i++){
						let row = this.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								let onlinePath = configUrl.imagesUrl+"emoji/"
								let imgstr = '<img src="'+onlinePath+EM.url+'">';
								desc+=EM.alt;
								return imgstr;
							}
						}
					}
				});
				return {text:replacedStr,desc:desc?desc:replacedStr};
			},
			formatMessage(content,type){
				let userId = getStorage("userId");
				let lastid = this.msgList.length>0?this.msgList.length+1:1;
				lastid++;
				let message={
				    type:"user",
					msg:{
						type:type,
						time:format(new Date(),"yyyy-MM-dd hh:mm:ss"),
						userinfo:{
						    uid:userId,
						    username:this.userinfo.nickName,
							face:this.userinfo.avatarUrl
								  
						},
					    content:{},
						id:lastid
					}
				};
				switch(type){
					case "text":
					   message.msg["content"]["text"] = content.text;
					   message.msg["content"]["desc"] = content.desc;
					   break;
					case "img":
					   message.msg["content"]["url"] = content.url;
					   message.msg["content"]["w"] = content.w;
					   message.msg["content"]["h"] = content.h;
					   message.msg["content"]["type"] = -1;
					   message.msg["content"]["desc"] = "[图片]";
					   break;
					case "voice":
					   message.msg["content"]["url"] = content.url;
					   message.msg["content"]["length"] = content.length;
					   message.msg["content"]["type"] = -1;
					   message.msg["content"]["desc"] = "[语音]";
					   break;
				}
				return message;
			},
			// 发送消息
			sendMsg(content,type,id){
				let userId = getStorage("userId");
				// 发送消息
				let msgA={
					toUserId:this.fromUserId,
					type,
					id
				}
				if(type=="text"){
					msgA["contentText"] = content.text;
					msgA["desc"] = content.desc;
				}else if(type=="img"){
					msgA["contentText"] = JSON.stringify(content);
					msgA["desc"]="[图片]"
				}else{
					msgA["contentText"] = JSON.stringify(content);
					msgA["desc"]="[语音]"
				}
				this.sendSocketMsg(msgA)
			},
			
			// 添加文字消息到列表
			addTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg){
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg){
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgImgList.push({url:msg.msg.content.url,type:-1});
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg,index){
				let rid = msg.content.rid;
				uni.showLoading({
					title:'加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(()=>{
					//加载数据
					if(rid==0){
						this.redenvelopeData={
							rid:0,	//红包ID
							from:"大黑哥",
							face:"/images/app/im/face/face.jpg",
							blessing:"恭喜发财，大吉大利",
							money:"已领完"
						}
					}else{
						this.redenvelopeData={
							rid:1,	//红包ID
							from:"售后客服008",
							face:"/images/app/im/face/face_2.jpg",
							blessing:"恭喜发财",
							money:"0.01"
						}
						if(!msg.content.isReceived){
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({text:"你领取了"+(msg.userinfo.uid==this.myuid?"自己":msg.userinfo.username)+"的红包"},'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';
					
				},200)
				
			},
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.windowsState = 'hide';
				setTimeout(()=>{
					this.windowsState = '';
				},200)
			},
			sendSystemMsg(content,type){
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let row = {type:"system",msg:{id:lastid,type:type,content:content}};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid){
				uni.navigateTo({
					url:'details/details?rid='+rid
				})
			},
			// 预览图片
			showPic(msg,type){
				console.log(this.msgImgList)
				uni.previewImage({
					indicator:"none",
					current:type==0?(this.imageUrl + msg.content.url):msg.content.url,
					urls: this.msgImgList.map(v=>v.type==0?(this.imageUrl+v.url):v.url)
				});
			},
			// 播放语音
			playVoice(msg,type){
				console.log(msg)
				if(this.playMsgid){
					return;
				}
				this.playMsgid=msg.content.url;
				this.AUDIO.src = type==-1?msg.content.url:(this.imageUrl + msg.content.url);
				console.log(type==-1?msg.content.url:(this.imageUrl + msg.content.url))
				this.$nextTick(function() {
					let _this = this;
					this.AUDIO.play();
					this.AUDIO.onTimeUpdate(function(e){
						let date = Math.floor(_this.AUDIO.currentTime)
						let min = parseInt(date/60);
						let sec = date%60;
						min = min<10?'0'+min:min;
						sec = sec<10?'0'+sec:sec;
						let length = min+':'+sec;
						_this.currentPlayDate = length;
					})
					
					this.AUDIO.onEnded(()=>{
						this.AUDIO.offTimeUpdate()
						this.AUDIO = uni.createInnerAudioContext();
						this.currentPlayDate="00:00";
						this.playMsgid = "";
					})
				});
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(e){
				let userId = getStorage("userId");				
				clearInterval(this.recordTimer);
				if(!this.willStop){
					let msg = {url:e.tempFilePath,length:0};
					let min = parseInt(this.recordLength/60);
					let sec = this.recordLength%60;
					min = min<10?'0'+min:min;
					sec = sec<10?'0'+sec:sec;
					msg.length = min+':'+sec;
					let message =this.formatMessage(msg,"voice");
					this.screenMsg(message);
					let msgid = message.msg.id;
					let userJWTandToken = uni.getStorageSync("userJWTandToken");
					let jwt = userJWTandToken.split('/')[0];
					uni.uploadFile({
						url: configUrl.requestUrl+`/app/tenement/${userId}/picture/message/upload/-1`,
						filePath: e.tempFilePath,
						name: 'fileResource',
						header:{
							'Authorization': jwt
						},
						formData: {
							'toUserid': this.fromUserId
						},
						success: (uploadFileRes) => {
							let voicestr = JSON.parse(uploadFileRes.data).resourceUrl
							msg.url=voicestr;
							this.sendMsg(msg,'voice',msgid);
							
						},
						fail:(e)=>{
							console.log()
						}
					});
				}else{
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			discard(){
				return;
			}
		},
		watch:{
			refreshMsg(value){
				if(value.type){
					this.pageNo=1;
					this.getMsgList(this.fromUserId);
				}
			},
			errorSendMsg(value){
				let task = {};
				if(value.length>0){
					value.map(v=>{
						if(!task.v){
							task[v] = true;
						}
					});
					this.sendErrorTask = Object.assign({},task)
				}else{
					this.sendErrorTask = {}
				}
			}
		}
	}
</script>
<style lang="scss">
	.load{
		width:100%;
		height: 60upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.text-value{
		color: #CCC;
		font-size: 26upx;
	}
	@import "@/static/css/style.scss"; 
</style>