<template>    
	<view class="container"> 
		<view id="moments" class="moments" @tap="blur()">
			<view class="moments__post post">
				<view class="user-info">
					<image class="avatar" :src="commentDetail.header_image"></image>
						<view class="user-data">
							<view class="user-content">
								<text class="nick-name">{{commentDetail.username}}</text>
								<image class="sex-icon" :src="commentDetail.gender==0?'../../../static/images/home_page/boy.png':'../../../static/images/home_page/girl.png'"></image>
							</view>
							<view class="timestamp">{{commentDetail.timestamp}}</view>
					   </view> 
				</view> 
				<view class="post_right">
					<view id="paragraph" class="paragraph">{{commentDetail.content.text}}</view>
					<!-- 相册 -->
					<view class="thumbnails">
						<view :class="commentDetail.content.images.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in commentDetail.content.images" :key="index_images">
							<image class="gallery_img" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(commentDetail.content.images,index_images)"></image>
						</view>
					</view>
					<!-- 资料条 -->
					<LikeDetail :dynamicId="commentDetail.id" :showLike="true" :isChangeComent="changeComent" @like="like(commentDetail.id)" :postIndex="index" @comment="comment" @reply="reply" :isChange="isChange"></LikeDetail>
					
				</view> 
				<!-- 结束 post -->
			</view>
			 <view v-for="(post,index) in posts" class="moments__post ">
			 	<view class="user-info">
			 		<image class="avatar" :src="post.avatar"></image>
			 			<view class="user-data">
			 				<view class="user-content">
			 					<text class="nick-name">{{post.userName}}</text>
			 					<image class="sex-icon" :src="post.gender==0?'../../../static/images/home_page/boy.png':'../../../static/images/home_page/girl.png'"></image>
			 				</view>
			 				<view class="timestamp">{{post.timestamp}}</view>
			 		   </view> 
					   <text class="response-btn"   v-on:click.stop="reply(post)">回复</text>  
			 	</view> 
			 	 
			 	<view class="post_right">
			 		<view id="paragraph" class="paragraph">{{post.content}}</view>	
			 	</view>
			 	<!-- 结束 post -->
			 </view> 

			<view class="foot" v-show="showInput">
				<chat-input @send-message="send_comment" :focus="focus" :placeholder="input_placeholder"></chat-input>
				<!-- <chat-input @send-message="send_comment" @blur="blur" :placeholder="input_placeholder"></chat-input> -->
			</view>
			<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
		</view>
</view>
</template>

<script>
	import getStorage from "../../../utils/getStorage.js"
	import chatInput from '../../../components/im-chat/chatinput.vue'; //input框
	import LikeDetail from "../like/likeDetail.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import info from "../../../utils/info.js"
	import {
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	
	export default {
		components: {
			uniLoadMore,
			chatInput,
			LikeDetail
		},
		data() {
			return {
				posts: [],//模拟数据
				index: '',
				comment_index: '',

				input_placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				is_reply: false, //回复还是评论
				showInput: false, //评论输入框

				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				
				downMoreStatus:"loading",
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多记录"
				},
				page:1,
				size:10,
				current:0,
				type:0,
				data:[],
				total:0,
				isChange:false,
				cur:{},
				changeComent:false,
				commentDetail:{},
				dynamicId:0
				
			}
		},
		props:{
			item:{}
		},
		mounted() {
			
			// uni.getStorage({
			// 	key: 'posts',
			// 	success: function (res) {
			// 		console.log(res.data);
			// 		this.posts = res.data;
			// 	}
			// });

		},
		computed:{
			...mapState({ 
				userinfo:state=>state.loginStore.userinfo
			}),
		},
		onLoad(e) {
			console.log(e)
			let userId = getStorage('userId');
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			})
			this.dynamicId =e.dynamicId
			let params ={
				pageNo:this.page,
				pageSize:this.size,
				userId,
				dynamicId:parseInt(e.dynamicId)
				
			}
			this.requestDetail({
				type:0,
				dynamicId:e.dynamicId,
				 userId
			})
			this.request(params,false);
			this.$store.dispatch("getUserInfo") 
		},
		onShow() {
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if(this.platform === 'ios'){
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				}else{
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
		},
		onHide() {
			uni.offWindowResize(); //取消监听窗口尺寸变化
		},
		onUnload() {
			this.max = 0,
				this.data = []
		},
		
		onReachBottom() { //监听上拉触底事件
			console.log('onReachBottom');
			let userId = getStorage('userId');
			if(this.changeDownMoreStatus()){
				return;
			}
			let params ={
				pageNo:this.page,
				pageSize:this.size,
				userId,
				dynamicId:this.dynamicId
				
			}
			this.request(params,false);
		},
		onPullDownRefresh() { //监听下拉刷新动作
			console.log('onPullDownRefresh');
			// 这里获取数据
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			let params ={
				pageNo:this.page,
				pageSize:this.size,
				userId,
				dynamicId:this.dynamicId
				
			}
			this.request(params,true);
		},
		onNavigationBarButtonTap(e) {//监听标题栏点击事件
			if (e.index == 0) {
				this.navigateTo('../publish/publish')
			}
		},
		methods: {
			selectChangeHandler(e){
				this.current = e;
				this.type = e;
			},
			requestDetail(param){
				this.$store.dispatch("getDynamicDetail",param)
				.then(res=>{
					let data = res.data.map(item=>{
						let dynamic ={
							id:item.id,
							username: item.userName,
							header_image: item.avatar,
							content: {
								text: item.content,
								images: item.image.split(",")
							},
							islike: item.isLike,
							like: [],
							comments: {
								total: 0,
								comment: []
							},
							timestamp: this.formatDate(new Date(item.createTime.replace("/","-")))
						} 
						return dynamic;
					})
					this.commentDetail = data[0]
				})
				.catch(e=>{
					console.log(e)
					info.toast(e.msg);
				})
			},
			reply(comment) {
				console.log("aaa")
				this.is_reply = true; //回复中
				this.showInput = true; //调起input框
				this.input_placeholder = '回复' + comment.userName;
				this.cur = comment;
				this.focus = true;
			},
			formatDate(date){
				let year = "" + date.getFullYear() + "";
				let month = "" + (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1) + "";
				let day = "" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "";
				let hour = "" + (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + "";
				let minute = "" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()) + "";
				let second = "" + (date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds()) + "";
				let time = date.getTime();
				let currentTime = new Date().getTime();
				let diffTime = (currentTime - time)/1000
				if(diffTime<60){
					return "刚刚";
				}else if(diffTime<60*60){
					return Math.floor(diffTime/60) +"分钟前";
				}else if(diffTime<24*60*60){
					return Math.floor(diffTime/60/60)+"小时前"
				}else if(diffTime<3*24*60*60){
					return Math.floor(diffTime/24/60/60)+"天前";
				}else if(diffTime<365*24*60*60){
					return month +"-" + day;
				}else{
					return year +"-" + month +"-" + day;
				}
			},
			request(params,isRefresh){ 
				console.log(params)
				this.$store.dispatch("getComent",{...params})
				.then(res=>{
					this.total = res.total;
					let data = res.comments.map(item=>{
						item["timestamp"] = this.formatDate(new Date(item.createTime.replace("/","-"))) 
						return item;
					})
					console.log(data)
					this.posts = this.posts.concat(data);
					if(isRefresh){
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
					if(res.comments.length==this.size){
						this.page = this.page+1;
					}
					
					this.changeDownMoreStatus()
				})
				.catch(e=>{
					if(isRefresh){
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
					console.log(e)
				});
			},
			test(){
				this.navigateTo('../test/test');
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			changeDownMoreStatus(){ 
				if(this.posts.length >= this.total){
					this.downMoreStatus = "noMore";
				}else{
					this.downMoreStatus = "loading"
				}
				if(this.downMoreStatus == "noMore"){ 
					return true;
				}
				return false
			},
			like(dynamicId) {  
				let userId = getStorage('userId');
				this.$store.dispatch("likeDynamic",{userId,dynamicId})
				.then(res=>{
					console.log(res)
					this.isChange = !this.isChange
				})
				.catch(e=>{
					console.log(e)
				})
			},
			comment(index) {
				this.showInput = true; //调起input框
				this.focus = true;
				this.index = index;
			},
			adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
				return;
				uni.createSelectorQuery().selectViewport().scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select("#post-" + this.index);
					view.boundingClientRect(data => {
						console.log("data:" + JSON.stringify(data));
						console.log("手机屏幕高度:" + this.screenHeight);
						console.log("竖直滚动位置" + scrollTop);
						console.log("节点离页面顶部的距离为" + data.top);
						console.log("节点高度为" + data.height);
						console.log("窗口高度为" + this.windowHeight);

						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50, 
							duration: 300
						});
					}).exec();
				}).exec();
			},
			blur: function() {
				this.init_input();
			},
			send_comment: function(message) {
				console.log(this.cur)
				let userId = getStorage('userId');
				let param = {
					userId,dynamicId:this.dynamicId,messagedId:0,content:message.content
				}
				console.log(this.is_reply)
				if(this.is_reply){
					param["messagedId"] = this.cur.id;
				} 
				this.$store.dispatch("sendComent",param)
				.then(res=>{
					console.log(res)
					console.log(this.userinfo)
					let post = res;
					res["avatar"] = this.userinfo.avatarUrl
					res["gender"] = this.userinfo.gender
					res["userName"] = this.userinfo.nickName
					post["timestamp"] = this.formatDate(new Date(res.createTime.replace("/","-")))
					this.posts = [post].concat(this.posts);
					this.init_input();
				})
				.catch(e=>{
					console.log(e)
				});
			},
			init_input() {
				this.showInput = false;
				this.focus = false;
				this.input_placeholder = '评论';
				this.is_reply = false;
			},
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
			goPublish() {
				uni.navigateTo({
					url: './publish/publish',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	@import url("../../../common/index/index.css");
	.container{
		width:100%;
		min-height: 100%!important;
		position: absolute;
		left:0;
		top:0;
		background-color: #FFF!important;
	}
	.post{
		border-bottom: 1px solid #eaeaea;
	}.user-info{
		width:100%;
		height: 70upx;
		display: flex;
		flex-direction: row;
		margin-bottom: 10upx;
		align-items: center;
		background: #FFF;
		.avatar{
				width:70upx;
				height:70upx;
				border-radius: 100px;
			}
			.user-data{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20upx;
				height: 100%;
				width: calc(100% - 135upx);
				.user-content{
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 40upx;
					.nick-name{
						font-size: 26upx;
						color:$uni-app-font-color;
					}
					.sex-icon{
						margin-left: 10upx;
						width:25upx;
						height: 25upx;
					}
				}
				.come-data{
					height: 30upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.come-text{
						font-size: 24upx;
						color:#999;
						margin-right: 10upx;
					}
				}
			}
			.turn-icon{
				width:45upx;
				height: 45upx;
			}
		.response-btn{
			width:100upx;
			text-align: right;
			font-size: 27upx;
			color:$uni-app-basic-color;
		}
	}
	.paragraph{
		margin-bottom: 5upx;
	}
	.timestamp{
	color: #757575;
	font-size: 22upx;
	}
</style>
