<template>
	<view class="msg-contain"
		 :style="{marginLeft:wid}"
		 @touchmove="handletouchmove" 
		 @touchstart="handletouchstart"
		 @touchend="handletouchend"
		 @tap="gotoDetailMsg(info.fromUserid,info.fromUserNickName)" 
	 >
		<image :src="info.fromUserAvatar" class="avatar"></image>
		<view class="detail">
			<text class="user-name">{{info.fromUserNickName}}</text>
			<text class="msg">{{info.content}}</text>
		</view>
		<view class="other">
			<text class="date">{{formateDate(info.createTime)}}</text>
			<uni-badge :text="info.noReadNums" v-if="info.noReadNums>0" type="error"></uni-badge>
		</view>
		<view class="delete-btn">删除</view>
	</view>
</template>

<script>
	import {formatDate} from "../../../utils/calDateDiff.js";
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		data() {
			return {	
				    flag: 0,
				    text: '',
				    lastX: 0,
				    lastY: 0,
					wid:0
			};
		},
		props:{
			info:Object
		},
		methods: {
		   handletouchmove(event) {
		            // console.log(event)
		     if (this.flag !== 0) {
		        return;
		    }
		    let currentX = event.touches[0].pageX;
		    let currentY = event.touches[0].pageY;
		    let tx = currentX - this.lastX;
		    let ty = currentY - this.lastY;
		    let text = '';
		    this.mindex = -1;
		    //左右方向滑动
		    if (Math.abs(tx) > Math.abs(ty)) {
		        if (tx < 0) {
		            text = '向左滑动';
		            this.flag = 1;
					this.wid = uni.upx2px(-150)+"px"
		            //  this.getList();  //调用列表的方法
		        } else if (tx > 0) {
		            text = '向右滑动';
		            this.flag = 2;
					this.wid=0;
		        }
		    }//将当前坐标进行保存以进行下一次计算
		    this.lastX = currentX;
		    this.lastY = currentY;
		    this.text = text;
		 },
		 handletouchstart(event) {
		    // console.log(event)
		    this.lastX = event.touches[0].pageX;
		    this.lastY = event.touches[0].pageY;
		},
		handletouchend(event) {
		    this.flag = 0;
		    this.text = '没有滑动';
		},
		gotoDetailMsg(id,nickName){
			uni.navigateTo({
				url:"../chat/chat?fromUserId="+id+"&nickName="+nickName
			});
		},
		formateDate(dateStr){
			return formatDate(new Date(dateStr),0)
		}
	},
	components:{
		uniBadge
	}
} 
</script>

<style lang="scss">
	.msg-contain{ 
		width:100%;
		display:flex;
		flex-direction:row;
		justify-content:space-between;
		height:130upx;
		align-items:center;
		padding:0 30upx;
		position: relative;
		box-sizing:border-box;
		transition:all 0.3s;
		.avatar{
			width:100upx;
			height:100upx;
			border-radius: 100%;
		}
		.detail{
			width:calc(100% - 250upx);
			margin-left: 10upx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: flex-start;
			.user-name{
				color:#000;
				font-size: 40upx;
			}
			.msg{
				width:100%;
				color:#808a87;
				font-size: 36upx;
				overflow:hidden; //超出一行文字自动隐藏
				text-overflow:ellipsis;//文字隐藏后添加省略号
				white-space:nowrap;
			}
		}
		.other{
			width:150upx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: flex-end;
			.date{
			   color:#808a87;
			   font-size: 30upx;
			}
		}
		.delete-btn{
			width:150upx;
			height:130upx;
			text-align: center;
			line-height: 130upx;
			position: absolute;
			right:-150upx;
			top:0;
			background:rgb(221,82,77);
			color:#FFF;
		}
	}
</style>
