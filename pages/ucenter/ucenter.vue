<template>
	<view class="container">
		<view class="user-info">
			<view class="user-name">
				<view class="name"><text>{{loginRes.nickName?loginRes.nickName:''}}</text> <image class="iconfont" :src="'../../static/images/home_page/'+(loginRes.gender==1?'boy.png':loginRes.gender==0?'girl.png':'')" style="margin-left: 10upx;color:#00CCFF"></image> </view>
				<view class="user-modify">编辑个人资料</view>
			</view>
			<view class="user-avatar">
				<image class="avatar" :src="loginRes.avatarUrl"></image>
			</view>
		</view>
		<view class="grid-view">
			<view class="grid-item" @tap="goBrowsingHistory">
				<view>
					<image class="grid-img" src="../../static/grid/足迹.png"></image>
				</view>
				<view>
					浏览记录
				</view>
			</view>
			<view class="grid-item" @tap="goPublishHistory">
				<view>
					<image class="grid-img" src="../../static/grid/发布.png"></image>
				</view>
				<view>
					我的发布
				</view>
			</view>
			<view class="grid-item" @tap="goCollect">
				<view>
					<image class="grid-img" src="../../static/grid/收藏.png"></image>
				</view>
				<view>
					我的收藏
				</view>
			</view>
<!-- 			<view class="grid-item">
				<view>
					<image class="grid-img" src="../../static/grid/合同.png"></image>
				</view>
				<view>
					合同模版
				</view>
			</view> -->
			<view class="grid-item" @tap="goWord">
				<view>
					<image class="grid-img" src="../../static/grid/留言.png"></image>
				</view>
				<view>
					留言
				</view>
			</view>
		</view>
		<view class="user-bottom-list">
			<view class="my-list-item">
				<image class="list-img" src="../../static/grid/设置.png"></image>
				<view class="list-text">我的设置</view>
				<view class="list-text-left"><i class="iconfont" style="">&#xe62d;</i></view>
			</view>
			<view class="my-list-item">
				<image class="list-img" src="../../static/grid/意见.png"></image>
				<view class="list-text">意见反馈</view>
				<view class="list-text-left"><i class="iconfont" style="">&#xe62d;</i></view>
			</view>
			<view class="my-list-item">
				<image class="list-img" src="../../static/grid/客服.png"></image>
				<view class="list-text">联系客服</view>
				<view class="list-text-left"><i class="iconfont" style="">&#xe62d;</i></view>
			</view>
		</view>
	</view>
</template>

<script>
	import RestApi from "../../utils/restApi/index.js";
	import uniGrid from "../../components/uni-grid/uni-grid.vue";
	import {
		mapState, 
		mapMutations,
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				login: false,
				avatarUrl: '/static/logo.png',
				uerInfo: {},
				firstLoad: false,
			}
		},
		computed: {
			...mapState({
				loginRes: state => state.loginStore.userinfo
			})
		},
		onReady() {
			setTimeout(() => {
				this.firstLoad = true;
			}, 1000);
			setTimeout(() => {
				console.log(this.loginRes)
			}, 3000)
		},
		onShow() {
		
		},
		onLoad(option) {
			this.getUserInfo()
		},
		methods: {
			// #ifdef  APP-PLUS || H5
			goAppLogin() {
				if (!this.login) {
					uni.navigateTo({
						url: "./login"
					});
				}
			},
			// #endif

			// #ifdef  MP-WEIXIN
			goWpLogin() {
				this.$store.dispatch("loginAction");
			},
			// #endif 

			getUserInfo() {
				this.$store.dispatch("getUserInfo");
			},
			goReleaseInvitation(){
				
			},
			goBrowsingHistory(){
				uni.navigateTo({
					url: "/pages/history/index"
				});
			},
			goPublishHistory(){
				uni.navigateTo({
					url: "/pages/my_publish/index"
				});
			},
			goCollect(){
				uni.navigateTo({
					url: "/pages/collect/index"
				});
			},
			goWord(){
				uni.navigateTo({
					url: "/pages/leaveWord/index"
				});
			}
			
		},
		components: {
			uniGrid,
		},
		watch:{
			loginRes(v){
				console.log(v)
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: 'iconfont';
		/* project id 1231468 */
		src: url('//at.alicdn.com/t/font_1231468_hk2nk0qcjkb.eot');
		src: url('//at.alicdn.com/t/font_1231468_hk2nk0qcjkb.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1231468_hk2nk0qcjkb.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1231468_hk2nk0qcjkb.woff') format('woff'),
			url('//at.alicdn.com/t/font_1231468_hk2nk0qcjkb.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1231468_hk2nk0qcjkb.svg#iconfont') format('svg');
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: absolute;
		height: 100%;
		width: 100%;
	}

	.iconfont {
		width:50upx;
		height: 50upx;
		margin-left: 10upx;
	}

	.user-info {
		height: 18%;
		width: calc(92vw - 60upx);
		margin-top: 40upx;
		border-radius: 8upx;
		display: flex;
		background-color: #fff;
		justify-content: space-between;
		align-items: center;
		box-shadow: 1upx 1upx 5px #d5d5d6;
		padding: 0 30upx;
	}

	.user-name {
		width: 80%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.name {
		font-size: 42upx;
		width: 100%;
		height: 90upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-weight: 500;
	}

	.user-modify {
		font-size: 26upx;
		color: #919392;
		width: 100%;
	}
	.user-modify:active{
		opacity: 0.5;
	}
	.user-avatar {
		width: 20%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.avatar {
		width: 110upx;
		height: 110upx;
		border-radius: 110upx;
	}

	.grid-view {
		margin-top: 27upx;
		background-color: #fff;
		width: 92vw;
		box-shadow: 1upx 1upx 5px #d5d5d6;
		height: calc(35% - 40upx);
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		border-radius: 8upx;
	}

	.grid-item {
		width: 30%;
		margin-left: calc(10% / 4);
		height: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #141a18;
	}

	.grid-item:active {
		opacity: 0.5;
	}

	.grid-img {
		height: 60upx;
		width: 60upx;
		margin-bottom: 10upx;
	}

	.user-bottom-list {
		box-shadow: 1upx 1upx 5px #d5d5d6;
		margin-top: 35upx;
		margin-bottom: 60upx;
		background-color: #fff;
		width: 92vw;
		height: calc(50% - 165upx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 8upx;
	}

	.my-list-item {
		width: 95%;
		height: 30%;
		font-size: 32upx;
		padding-top: calc(10% / 4);
		padding-bottom: calc(10% / 4);
		border-bottom: 1px solid #f6f6f6;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-list:after {
		height: 0 !important;
	}

	.my-list-item:active {
		opacity: 0.5;
	}

	.list-img {
		height: 60upx;
		width: 60upx;
	}

	.list-text {
		margin-left: 20upx;
		width: calc(95% - 80upx);
	}

	.list-text-left {
		width: 5%;
	}
</style>
