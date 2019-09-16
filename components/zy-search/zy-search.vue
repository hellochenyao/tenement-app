<template name="zy-search">
	<view class="content">
		<view class="search"> 
			<template v-if="isFocus">
				<input maxlength="20" focus type="text" @input="getsuggest" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索"  v-model.trim="searchText"/>
			</template>
			<template v-else>
				<input maxlength="20" type="text" @input="getsuggest" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索" v-model.trim="searchText"/>
			</template>
			<image src="../../static/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image>
		</view>
		<view v-for="(item,index) in suggestion" :key="index" class="location" @tap="backfill(item.title)">
			    <!--根据需求渲染相应数据-->
				<!--渲染地址title-->
				<view :id="index" class="title">{{item.title}}</view>
				<!--渲染详细地址-->
				<view class="value">{{item.addr}}</view>
		</view>
		<template v-if="isBlock">
			<view class="s-block" v-if="hList.length > 0">
				<view class="header">
					历史记录
					<image src="../../static/zy-search/delete.svg" mode="aspectFit" @click="delhistory"></image>
				</view>
				<view class="list">
					<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
				</view>
			</view>
			<view class="wanted-block" v-if="showWant">
				<view class="header">猜你想搜的</view>
				<view class="list">
					<view v-for="(item,index) in wantList" :key="index" @click="keywordsClick(item)">{{item}}</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="s-circle" v-if="hList.length > 0">
				<view class="header">
					历史记录
					<image src="../../static/zy-search/delete.svg" mode="aspectFit" @click="delhistory"></image>
				</view>
				<view class="list">
					<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
				</view>
			</view>
			<view class="wanted-circle" v-if="showWant">
				<view class="header">猜你想搜的</view>
				<view class="list">
					<view v-for="(item,index) in wantList" :key="index" @click="keywordsClick(item)">{{item}}</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {qqmapsdk} from "../../utils/QQMapWXConfig.js"
	export default{
		name:"zy-search",
		props:{
			isFocus:{	//是否自动获取焦点
				type:Boolean,
				value:false
			},
			isBlock:{	//选择块级显示还是圆形显示
				type:Boolean,
				value:true
			},
			showWant:{	//是否展示推荐菜单
				type:Boolean,
				value:false
			}
		},
		data() {
			return {
				searchText:'',								//搜索关键词
				hList:uni.getStorageSync('search_cache'),		//历史记录
				wantList:['栏目1','栏目2','栏目3','栏目4']	,//初始化推荐列表
				suggestion:[]
			};
		},
		methods: {
			searchStart: function() {	//触发搜索
				let _this = this;
				if (_this.searchText == '') {
					uni.showToast({
						title: '请输入关键字',
						icon: 'none',
						duration: 1000
					});
					return false;
				}else{
					uni.getStorage({
						key:'search_cache',
						success(res){
							let list = res.data;
							console.log(list);
							if(list.length > 5){
								for(let item of list){
									if(item == _this.searchText){
										return false;
									}
								}
								list.pop();
								list.unshift(_this.searchText);
							}else{
								for(let item of list){
									if(item == _this.searchText){
										return false;
									}
								}
								list.unshift(_this.searchText);
							}
							_this.hList = list;
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
						},
						fail() {
							_this.hList = [];
							_this.hList.push(_this.searchText);
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
						}
					})
				}
			},
			backfill(v) {
				this.searchText= v
				this.suggestion=[]
			},
			getsuggest(e) {
			    var _this = this;
				console.log(qqmapsdk)
			    //调用关键词提示接口
			    qqmapsdk.getSuggestion({
			      //获取输入框值并设置keyword参数
			      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
			      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
			      success: function(res) {//搜索成功后的回调
			        console.log(res);
			        var sug = [];
			        for (var i = 0; i < res.data.length; i++) {
			          sug.push({ // 获取返回结果，放到sug数组中
			            title: res.data[i].title,
			            id: res.data[i].id,
			            addr: res.data[i].address,
			            city: res.data[i].city,
			            district: res.data[i].district,
			            latitude: res.data[i].location.lat,
			            longitude: res.data[i].location.lng
			          });
			        }
					_this.suggestion = sug
			      },
			      fail: function(error) {
			        console.error(error);
			      },
			      complete: function(res) {
			        console.log(res);
			      }
			    });
			},
			keywordsClick (item) {	//推荐搜索
				this.searchText = item;
			},
			delhistory () {		//清空历史记录
				this.hList = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
			},
			startRecognize: function() {	//语音输入
				let _this = this;
				let options = {};
				options.engine = 'iFly';
				options.punctuation = false; // 是否需要标点符号 
				options.timeout = 10 * 1000;
				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
				});
			}
		}
	}
</script>

<style lang="less" scoped> 
	page{
		width:100%;
		min-height: 100%;
		background: #FFF!important;
	}
	.search{
		width: 640upx;
		margin: 30upx auto 0;
		position: relative;
		input{
			background: #F7F7F7;
			padding: 10upx 15upx;
			font-size: 36upx;
		}
		// .voice-icon{
		// 	width: 36upx;
		// 	height: 36upx;
		// 	padding: 16upx 20upx 16upx 0;
		// 	position: absolute;
		// 	left: 16upx;
		// 	top: 4upx;
		// 	z-index: 10;
		// }
		.search-icon{
			width: 36upx;
			height: 36upx;
			padding: 16upx 20upx 16upx 0;
			position: absolute;
			right: 0;
			top: 4upx;
			z-index: 10;
		}
	}
	.location{
		width:640upx;
		height:100upx;
		background: #F7F7F7;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding:5upx 15upx;
		align-items: flex-start;
		border:1px solid #eaeaea;
		margin:0 auto;
		border-top:0;
		&:first-of-type{
			margin-top: 30upx;
			border-top: 1px solid #eaeaea;
		}
		.title{
			width:100%;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			font-size: 30upx;
		}
		.value{
			width:100%;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			font-size: 26upx;
			color:#666;
		}
	}
	.s-block{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
			position: relative;
			image{
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 20upx 0;
				border-top: 2upx solid #FFF;
    			border-left: 2upx solid #FFF;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				background-color: #F7F7F7;
			}
		}
	}
	.s-circle{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
			border-bottom: 2upx solid #F9F9F9;
			position: relative;
			image{
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;
			view{
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
	.wanted-block{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 20upx 0;
				border-top: 2upx solid #FFF;
				border-left: 2upx solid #FFF;
				background-color: #F7F7F7;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.wanted-circle{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;
			view{
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
</style>
