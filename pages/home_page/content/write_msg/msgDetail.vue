<template>
	<view>
		<view class="bg-container" v-if="type"></view>
		<view class="container" :style="{height:type?'70%':0}">
			<view class="title-bar">
				<image src="../../../../static/images/page/关闭.png" class="close" @tap="showDetailHandler(false)"></image>
				<text class="title">1楼的回复</text>
			</view>
			<view class="msg-content" id="view">
				<res-msg :msg="res"></res-msg>
			</view>
			<view class="res" :style="{height:height}">
				<view class="noDataContent" :style="{height:height}" v-if="res.resDetail.length==0">
				<image src="../../../../static/wenju-mescroll/mescroll-empty.png" class="no-data" mode='aspectFit'></image>
				<text class="noDataDetail">别让楼主寂寞太久哦</text>
				</view>
				<res-msg :key="index" :msg="item" v-for="(item,index) in res.resDetail"></res-msg>
			</view>
		</view>
	</view>
</template>

<script>
	import ResMsg from "./resMsg"
	import {getNodeHeight,getSystem} from "../../../../utils/config.js"
	export default {
		data() { 
			console.log(this.res)
			return {
				type:false,
				height:"0px"
			}
		},
		props:{ 
			res:{},
			detailType:Boolean
		},
		components: {
			ResMsg
		},
		async mounted() {
			let systeminfo =await getSystem();
			console.log(systeminfo)
			const query = uni.createSelectorQuery().in(this);
			query.select('#view').boundingClientRect(data => {
			  this.height = systeminfo.windowHeight*0.7 - data.height - uni.upx2px(90) - 1 +"px";
			  console.log(this.height)
			}).exec();
		},
		methods: {
			showDetailHandler(type){
				this.type = type;
				this.$emit("changeType",type);
				this.$store.dispatch("responseUserAction",{})
			}
		},
		watch:{
			detailType(value){
				this.type = value;
			}
		}
	}
</script>

<style lang="scss">
	.bg-container{
		width:100%;
		height:100%;
		background: #000;
		opacity: 0.7;
		position: fixed;
		z-index: 100;
		left:0;
		top:0;
	}
	.container{
		width:100%;
		height:70%;
		box-sizing: border-box;
		position: fixed;
		z-index: 1000;
		transition: all 0.3s;
		left:0;
		bottom:80upx;
		background: #FFF;
		.title-bar{
			width:100%;
			height: 90upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #eaeaea;
			position: relative;
			.close{
				width:50upx;
				height: 50upx;
				position: absolute;
				left:10upx;
				top:20upx;
			}
			.title{
				font-size: 30upx;
				color:#000;
			}
		}
		.msg-content{
			width:100%;
			padding:10upx 10upx 0upx 10upx;
			box-sizing: border-box;
			border-bottom: 16upx solid #eaeaea;
		}
		.res{
			width:100%;
			height: calc(100% - 90upx);
			padding:10upx;
			box-sizing: border-box;
			overflow-y: auto;
			.noDataContent{
				width:100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.no-data{
					width:50%;
					height:130px;
				}
				.noDataDetail{
					font-size:23upx;
					color:#CCC;
					margin-top: 30upx;
				}
			}
		}
	}
</style>
