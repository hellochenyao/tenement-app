<template name="zy-search">
	<view class="content">
		<view class="search"> 
			<template v-if="isFocus">
				<input maxlength="20" focus type="text" @input="getsuggest" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索"  v-model.trim="searchText"/>
			</template>
			<template v-else>
				<input maxlength="20" type="text" @input="getsuggest" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索" v-model.trim="searchText"/>
			</template>
			<image src="../../static/zy-search/search.svg" mode="widthFix" @click="searchStart()" class="search-icon"></image>
		</view>
		<view class="location" v-if="!close">
			<view class="invitation-search">
				<image src="../../static/images/home_page/invitation.png" mode="widthFix" class="icon"></image>
				<text class="content" @tap="backfill(searchText,'')">{{searchText}}（搜帖子）</text>
			</view>
			    <!--根据需求渲染相应数据-->
				<!--渲染地址title-->
			<view class="detail"  v-for="(item,index) in suggestion" :key="index" @tap="backfill(item.title,index)">
				<image src="../../static/images/home_page/tag.png" mode="widthFix" class="icon"></image>
				<view class="content">
				<text :id="index" class="title">{{item.title}}</text>
				<!--渲染详细地址-->
				<text class="value">{{item.addr}}</text>
				</view>
			</view>
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
	import getStorage from "../../utils/getStorage.js"
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
			},
			city:String,
			current:0,
			text:String
		},
		data() {
			return {
				searchText:this.text,								//搜索关键词
				hList:uni.getStorageSync('search_cache'),		//历史记录
				wantList:['栏目1','栏目2','栏目3','栏目4']	,//初始化推荐列表
				suggestion:[],
				close:true
			};
		},
		methods: {
			searchStart: function() {	//触发搜索
				let _this = this;
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
				this.$emit("query",{
					text:this.searchText,
					type:""
				})
			},
			backfill(v,i) {
				this.searchText= v
				this.suggestion=[]
				if(i==""){
					this.$emit("query",{
						text:this.searchText,
						type:"title"
					})
				}else{
					this.$emit("query",{
						text:this.searchText,
						type:"location"
					})
				}
				let _this = this;
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
				this.close = true;
			},
			getsuggest(e) {
			    var _this = this;
				console.log(this)
				this.close = false;
			    //调用关键词提示接口
			    qqmapsdk.getSuggestion({
			      //获取输入框值并设置keyword参数
				  region:this.city,
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
		},
		watch:{
			text(v){
				this.searchText=v
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
		width: 95%;
		margin: 30upx auto 0;
		position: relative;
		input{
			width:100%;
			box-sizing: border-box;
			background: #F7F7F7;
			height: 70upx;
			padding-left: 20upx;
			line-height: 70upx;
			font-size: 30upx;
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
			top: 2upx;
			z-index: 10;
		}
	}
	.location{
		width:95%;
		height:600upx;
		background: #F7F7F7;
		box-sizing: border-box;
		overflow: auto;
		padding:0upx 15upx;
		border-bottom:1px solid #eaeaea;
		margin:0 auto;
		border-top:0;
		.invitation-search{
			width:100%;
			height:90upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding:10upx 0;
			.icon{
				width:60upx;
				height:90upx;
				margin-right: 20upx;
			}
			.content{
				width:calc(100% - 70upx);
				height: 90upx;
				line-height: 90upx;
				font-size: 30upx;
				border-bottom: 1px solid #eaeaea;
			}
		}
		.detail{
			width:100%;
			height:90upx;
			display:flex;
			flex-direction:row;
			align-items: center;
			box-sizing:border-box;
			&:last-of-type{
				.content{
					border-bottom: 0;
				}
			}
			.icon{
				width:70upx;
				height:90upx;
				margin-right: 10upx;
			}
			.content{
				width:calc(100% - 80upx);
				height:90upx;
				display:flex;
				flex-direction:column;
				justify-content: center;
				border-bottom: 1px solid #eaeaea;
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
