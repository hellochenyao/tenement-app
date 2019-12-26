<template> 
	<view>
		<view class="status_bar" :style="{height:statHeight+'px'}"></view>
		<view class="navContainer" id="nav" :style="{top:statHeight+'px'}">
			<view class="navigationBar" :style="{height:titleHeight+'px'}">
				<view class="select-city-contain" @tap="selectCityHandler">
					<image class="city-icon" src="../../static/images/home_page/location.png"></image>
					<text class="city-name">{{currentCity}}</text>
					<image class="city-icon" src="../../static/images/home_page/down.png"></image>
				</view>
				<view class="search-container" @tap="getSearch" :class="{'focus-search':focusType}">
					<input class="search-input" disabled @blur="focusSearch" @focus="focusSearch" placeholder="搜帖子" placeholder-class="search-place"
					 :value="searchTitle?searchTitle:detailLocation"></input>
					<image class="search-icon" src="../../static/images/home_page/search.png"></image>
				</view>
			</view>
			<top-select-bar :current="current" @changeCurrent="selectChangeHandler" :data="['求租帖','房源帖']"></top-select-bar>
		</view>
		<view :style="{marginTop:topHeight+'px'}"/>
		<mescroll-uni :up="upOption" :down="downOption" @down="downCallback" @up="upCallback" @init="mescrollInit" >
			<view v-if="current==0" class="swiper-item-tab" :key="index" v-for="(data,index) in invitationList">
				<invitation-component  class="invitationId" :type="current" :dat="data" :showType="'content'"></invitation-component>
			</view>
			<view v-if="current==1" class="swiper-item-tab uni-bg-green" :key="index" v-for="(data,index) in invitationList">
				<invitation-component  class="invitationId" :type="current" :dat="data" :showType="'content'"></invitation-component>
			</view>
		</mescroll-uni>
		<!-- <image v-if="haveAgreedType" src="../../static/images/home_page/agree.png" class="agree-img" :class="haveAgreedType?'agree':''"></image> -->
	</view>
</template>

<script>
	import MescrollUni from "@/components/uni-mescroll/mescroll-xinlang.vue";
	import scrollTab from "@/components/scroll-tab/scroll-tab.vue";
	import TopSelectBar from "../../components/top-select-bar/index.vue";
	import InvitationComponent from "../../components/invitation-component/index.vue";
	import RestApi from "../../utils/restApi/index.js";
	import getStorage from "../../utils/getStorage.js"
	import {  
	    mapState,  
	    mapMutations, 
		mapActions 
	} from 'vuex';
	
	import {qqmapsdk} from "../../utils/QQMapWXConfig.js";
	
	export default {
		data() {
			return {
				showChooseCity: true,
				indicatorDots: false,
				interval: 2000,
				duration: 500, 
				mescroll: null, //mescroll实例对象
				downOption: {
					auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
				},
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
				addList: [], //新增微博
				dataList: [], // 数据列表
				top: 0, //提示,到顶部的距离
				searchContent: "",
				focusType: false,
				currentCity: "",
				amapPlugin: null,
				current: 0,
				statHeight:25,
				topHeight:0,
				refreshType:0,
				invitationList:[],
				haveAgreedType:false,
				titleHeight:0,
				invitationHeight:0,
				detailLocation:"",
				searchTitle:""
			}
		},
		components: {
			scrollTab,
			MescrollUni,
			TopSelectBar,
			InvitationComponent
		},
		computed:{
			...mapState({ 
				invitationRes:state=>state.invitateStore.invitationList,
				loading:state=>state.invitateStore.loading
			})
		}, 
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		onLoad(event) {
			let _this = this;
			let data = wx.getMenuButtonBoundingClientRect()
			this.titleHeight = data.height 
			uni.getSystemInfo({
				success(res) { 
					if(res.model == "iPhone X"){
						_this.statHeight = res.statusBarHeight ; //兼容iphonex
					}
				}
			});
			
		},
		onShow(event) {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.data.isDoRefresh == true) {
				currPage.data.isDoRefresh = false;
				this.currentCity = currPage.data.city;
				this.mescroll.resetUpScroll();
			}
			
			if(currPage.data.isDoSearch){
				currPage.data.isDoSearch = false;
				this.detailLocation = currPage.data.detailLocation
				this.searchTitle = currPage.data.title;
				this.mescroll.resetUpScroll();
			}
			
		},
		 onReady(){
		      this.calNavigationHeight("nav")
	    },
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			getSearch(){ 
				let searchText=this.detailLocation?this.detailLocation:this.searchTitle
				uni.navigateTo({
					url: '../search/search?current='+this.current+'&city='+this.currentCity+"&searchText="+searchText
				});
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				let _this = this;
				if(this.currentCity ==""){
					qqmapsdk.reverseGeocoder({
						  success: function(res) {//成功后的回调
							_this.currentCity = res.result.address_component.city;
						    _this.getInvitationData(mescroll.num, mescroll.size);
						  }
					})
				}else{
					this.getInvitationData(mescroll.num, mescroll.size);
				}
			},
			calNavigationHeight(id){
				let _this = this; 
				const query = uni.createSelectorQuery().in(this); 
				query.select('#'+id).boundingClientRect(data => {
					_this.topHeight = data.height + _this.statHeight + uni.upx2px(20);
				}).exec();
			},
			focusSearch() {
				this.focusType = !this.focusType;
			},
			selectChangeHandler(event){
				this.current = event;
				this.downCallback();
				this.invitationList = [];
			},
			selectCityHandler() { 
				uni.navigateTo({
					url: './choose_city'
				});
			},
			// currentChangeHandler(event) {
			// 	if (event.detail) {
			// 		this.current = event.detail.current;
			// 	} else {
			// 		this.current = event;
			// 	}
			// 	this.downCallback();
			// 	
			// }, 
			getInvitationData(pageNo,pageSize){
				let userId = getStorage('userId');
				this.$store.dispatch("findInvitation",{
					id:userId,
					type:this.current,
					city:this.currentCity,
					location:this.detailLocation==""?"":this.detailLocation,
					title:this.searchTitle?this.searchTitle:"",
	
					pageNo,
					pageSize
				});
			}
			// haveAgreed(){
			// 	this.haveAgreedType = true;
			// 	setTimeout(()=>{
			// 		this.haveAgreedType = false;
			// 	},1000)
			// }
		},
	watch:{
		invitationRes(val){
			let haveNext=true;
			if(this.mescroll){
				if(val.code){
					this.mescroll.endErr();
				}else{
					if(this.mescroll.num === 1){
						this.invitationList = [];
					}
					this.invitationList = this.invitationList.concat(val.data);
					if(this.invitationList.length==val.total){
						haveNext = false;
					}
					this.mescroll.endSuccess(this.invitationList.length, haveNext);
				}
			}
		}
	}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: 'iconfont';
		/* project id 1231468 */  
		src: url('//at.alicdn.com/t/font_1231468_h93wirotdw.eot');
		src: url('//at.alicdn.com/t/font_1231468_h93wirotdw.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1231468_h93wirotdw.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1231468_h93wirotdw.woff') format('woff'),
			url('//at.alicdn.com/t/font_1231468_h93wirotdw.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1231468_h93wirotdw.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 28upx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
		color: #FFF;
	}
	.agree-img{
		width:50%;
		height: 400upx;
		position: absolute;
		left:25%;
		top:300upx;
	}
	@keyframes agreeAnimation{
		
		0%{
			transform: rotate(0deg) scale(0);
		}
		50%{
			transform: rotate(30deg) scale(0.5);
		}
		100%{
			transform: rotate(-30deg) scale(1);
		}
	}
	.agree{
		animation: agreeAnimation 1s;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: $uni-app-basic-color;
		position: fixed;
		top: 0;
		z-index: 999;
	}

	/* iPhone X in portrait & landscape */
	@media only screen and (device-width: 375px) and (device-height: 812px) {
		.status_bar {
			 height: 68upx !important;
		}
		.navigationBar {
			top: 68upx !important;
		}
	}
	.navContainer{
		width:100%;
		position: fixed;
		z-index: 999;
		left: 0;
		top: var(--status-bar-height);
	}
	.navigationBar { 
		width: 100%;
		height: 44px;
		background-color: $uni-app-basic-color;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.swiper {
		width: 100%;
		height: 100%;
	}

	.swiper-item-tab {
		width: 100%;
	}

	image {
		width: 100%;
	}

	.header {
		z-index: 9900;
		position: fixed;
		top: --window-top;
		left: 0;
		height: 100upx;
		background: #fff;
	}

	.footer {
		z-index: 9900;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100upx;
		background: white;
	}

	.download-tip {
		z-index: 900;
		position: fixed;
		top: 20upx;
		left: 0;
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		font-size: 24upx;
		text-align: center;
		background-color: rgba(255, 130, 1, .7);
		color: white;
		-webkit-transition: top 300ms;
		transition: top 300ms;
	}

	/*展示上拉加载的数据列表*/
	.news-li {
		height: 100upx;
		padding: 32upx;
		border-bottom: 1upx solid #eee;
	}

	.news-li .new-content {
		font-size: 28upx;
		margin-top: 10upx;
		margin-left: 20upx;
		color: #666;
	}


	.select-city-contain {
		width: 30%;
		height: 30upx;
		padding-left: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		.city-icon {
			width: 35upx;
			height: 35upx;
			margin-right: 5upx;
		}

		.city-name {
			font-size: 26upx;
			color: #FFF;
		}
	}

	.search-container {
		width: 30%;
		height: 55upx;
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-width: 1upx;
		border-style: solid;
		border: 1upx solid rgba(255, 255, 255, .5);
		border-radius: 50upx;
		transition: all .2s ease-in-out;
		position: relative;

		.search-input {
			width: 90%;
			height: 100%;
			font-size:30upx;
			padding: 10px;
		}

		.search-icon {
			width: 40upx;
			height: 36upx;
			position: absolute;
			right: 10upx;
			top: 9.5upx;
		}

		.search-place {
			color: #FFF;
		}
	}

	.focus-search {
		width: 40%;
		border: 1px solid #FFF;
	}
</style>
