<template>
	<view class="contant-container">
		<view class="user-info">
			<image class="avatar" src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3914950518,3569645197&fm=27&gp=0.jpg"></image>
			<view class="user-data">
				<view class="user-content">
					<text class="nick-name">小刷个</text>
					<image class="sex-icon" src="../../../static/images/home_page/girl.png"></image>
				</view>
				<view class="come-data">
					<text class="come-text">刚在线</text>
					<text class="come-text">浏览6次</text>
				</view>
			</view>
			<image class="turn-icon" src="../../../static/images/home_page/turn1.png"></image>
		</view>
		<view class="invitation-title">
			<text class="title">出租印江山大楼，价格非常贵，非常诚心的请勿打扰<text class="location">/印江山</text></text>
		</view>
		<view class="invitation-condition">
			<view class="condition">
				<view class="budget">
					<image class="img" src="../../../static/images/home_page/budget.png"></image>
					<text class="condition-name">租金</text>
					<text class="condition-value">￥1000元/月</text>
				</view>
				<view class="publish">
					<image class="img" src="../../../static/images/home_page/publish.png"></image>
					<text class="condition-name">发布于5月23日</text>
				</view>
				<view class="location">
					<image class="img" src="../../../static/images/home_page/locationContent.png"></image>
					<text class="condition-name">印江山</text>
				</view>
			</view>
			<view class="location-map">
				<map class="map" :latitude="26.08198" :longitude="119.30405" :markers="covers" @tap="clickMap" :circles="circles">
                </map>
			</view>
		</view>
		<view class="invitation-desc">
			<view class="desc">
				<text class="desc-text">具体要求</text>
			</view>
			<text class="desc-content">很好</text>
		</view>
		<view class="write-msg">
			<view class="desc">
				<text class="desc-text">留言（{{msgRes.total?msgRes.total:0}}）</text>
			</view>
			<view v-if="false" class="haveno-msg">
				<image src="../../../static/wenju-mescroll/mescroll-empty.png"/>
			</view>
			<write-msg v-for="(item,idx) in msgRes.details" :key="idx" :vid="idx===0?true:false" @setCurrentSelectMsg="setCurrentSelectMsg" :dat="item"></write-msg>
		</view>
		<view class="invitation-bottom-tab">
			<view v-if="!currentResponseUser.nickName" class="tab-content">
				<image class="tab-img" src="../../../static/images/home_page/turn.png"/>
				<text class="tab-text">转发</text>
			</view>
			<view v-if="!currentResponseUser.nickName" class="tab-content">
				<image class="tab-img" src="../../../static/images/home_page/shouchang.png"/>
				<text class="tab-text">收藏</text>
			</view>
			<input v-if="currentResponseUser.nickName" class="response-input" :placeholder="'回复:'+(currentResponseUser.nickName?currentResponseUser.nickName:'')" v-model="res" />
			<button class="return" @tap="resClick">{{!currentResponseUser.nickName?'回复ta':'发送'}}</button>
		</view>
		<msg-detail :res="selectMsg" :detailType="detailType" @changeType="changeDetailTypeValue"></msg-detail>
	</view>
</template>

<script>
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import writeMsg from './write_msg/index';
	import getStorage from "../../../utils/getStorage.js"
	import MsgDetail from "./write_msg/msgDetail";
	export default {
		data() { 
			return {
				res:'',
				hideButton:false,
				invitationId:"",
				msgRes:{},
				selectMsg:{},
				detailType:false
			}
		},
		components: {
			writeMsg,
			MsgDetail
		},
		
		onLoad(event) {
			
			this.invitationId = event.id;
			this.getWriteMsg(event.id);
		},
		computed:{
			...mapState({ 
				currentResponseUser:state=>state.invitateStore.currentResponseUser
			})
		},
		methods: {
			clickMap(){
				 uni.openLocation({
					latitude: 26.08198,
					longitude: 119.30405,
					success: function () {
						console.log('success');
					},
				});
			},
			resClick(){
				this.hideButton = !this.hideButton;
				let userId = getStorage('userId');
				this.$store.dispatch("responseMsg",{userId:userId,invitationId:parseInt(this.invitationId),answerMsgId:this.currentResponseUser.invitationId,msg:this.res,responseUserId:this.currentResponseUser.id})
				.then(res=>{
					console.log(res)
					this.getWriteMsg(this.invitationId)
				})
				.catch(e=>{
					console.log(e)
				})
			}
			,
			getWriteMsg(invitationId){
				let userId = getStorage('userId');
				this.$store.dispatch("findMsg",{id:userId,invitationId})
				.then(res=>{
					this.msgRes = res;
				})
				.catch(err=>{
					console.log(err)
				});
			},
			setCurrentSelectMsg(data){
				this.selectMsg = data;
				this.detailType = true;
			},
			changeDetailTypeValue(type){
				this.detailType = type;
			}
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	.contant-container{
		background: #FFF;
		padding:10upx 20upx;
		width:100%;
		height: 100%;
		box-sizing: border-box;
	}
	.user-info{
		width:100%;
		height: 70upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 30upx;
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
	}
	.invitation-title{
		width:100%;
		margin:40upx 0 30upx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		.title{
			font-size: 32upx;
			font-weight: bold;
			color:$uni-app-font-color;
		}
		.location{
			margin-left: 20upx;
			font-size: 26upx;
			color:#999;
		}
	}
	.invitation-condition{
		width:100%;
		padding:0 0 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		.condition{
			display: flex;
			flex-direction: column;
			width: calc(100% - 170upx);
			.budget,.publish,.location{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 10upx;
				margin-bottom: 10upx;
				.img{
					width:35upx;
					height: 35upx;
			     	margin-right: 10upx;
				}
				.condition-name{
					font-size:28upx;
					color:#999;
					margin-right: 10upx;
				}
				.condition-value{
					font-size: 28upx;
					color:$uni-app-other-color;
				}
			}
		}
	}
	.location-map{ 
		width:130upx;
		height:130upx;
		border-radius: 100px;
		overflow: hidden;
		margin-right: 40upx;
		.map{
			width:130upx;
			height:130upx;
		}
	}
	.invitation-desc{
		width:100%;
		display: flex;
		flex-direction: column;
		.desc{
			margin-top: 30upx;
			.desc-text{
				font-size: 31upx;
				font-weight: 500;
			}
		}
		.desc-content{
			font-size: 27upx;
			color:#999;
			margin-top: 10upx;
			min-height: 160upx;
		}
	}
	.write-msg{
		width:100%;
		margin-bottom: 60upx;
		display: flex;
		flex-direction: column;
		.desc{
			margin-top: 30upx;
			.desc-text{
				font-size: 31upx;
				font-weight: 500;
			}
		}
		.haveno-msg{
			width:100%;
			display:flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
	}
	.invitation-bottom-tab{
		width:100%;
		height:60upx;
		padding:10upx 20upx;
		display: flex;
		z-index: 1006;
		flex-direction: row;
		background: #FFF;
		border-top: 1px solid $uni-app-border-color;
		position: fixed;
		left:0;
		bottom:0;
		.response-input{
			width:calc(100% - 160upx);
			height:60upx;
			border:1px solid $uni-app-border-color;
			border-radius: 5px;
			font-size: 27upx;
			padding-left: 10upx;
		}
		.tab-content{
			width:110upx;
			height:60upx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			.tab-img{
				width:35upx;
				height: 35upx;
			}
			.tab-text{
				font-size:26upx;
			}
			&:first-child{
				margin-right: 30upx;
			}
		}
		.return{
			height:60upx;
			line-height: 60upx;
			text-align: center;
			background: $uni-app-basic-color;
			position: absolute;
			right:60upx;
			top:10upx;
			color:#FFF;
			font-size: 27upx;
		}
	}
</style>
