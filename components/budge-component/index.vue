<template>
	<uni-popup ref="popup" @touchmove.stop.prevent="" type="bottom" @change="changePop">
		<view class="budge">
			<text class="budge-text">￥</text>
			<input type="text" class="budge-input" placeholder="请输入价格" disabled="true" :value="budge"/>
		</view>
		<view class="content">
			<view class="key-content">
				<view class="key">
					<text class="keyText" @tap="clickKey(1)">1</text>
					<text class="keyText" @tap="clickKey(2)">2</text>
					<text class="keyText" @tap="clickKey(3)">3</text>
				</view>
				<view class="key">
					<text class="keyText" @tap="clickKey(4)">4</text>
					<text class="keyText" @tap="clickKey(5)">5</text>
					<text class="keyText" @tap="clickKey(6)">6</text>
				</view>
				<view class="key">
					<text class="keyText" @tap="clickKey(7)">7</text>
					<text class="keyText" @tap="clickKey(8)">8</text>
					<text class="keyText" @tap="clickKey(9)">9</text>
				</view>
				<view class="key">
					<text class="keyText"></text>
					<text class="keyText" @tap="clickKey(0)">0</text>
					<text class="keyText"></text>
				</view>
			</view>
			<view class="button-group">
				<button type="primary" class="check-btn" @tap="closePopup">确定</button>
				<view class="delete-btn" @tap="deleteKey">
					<image src="../../static/images/page/关闭.png" class="close"></image>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
	    data() {
	        return {
	            budge:""
	        }
	    },
		props: ["visible"], 
	    components: {
			uniPopup
	    },
	    methods: {
			changePop(v){
				if(!v.show){
					console.log("a")
					this.$emit("choseVal",{
						budget:this.budge,
						visible:false
					});
				}
			},
			deleteKey(){
				if(this.budge.length==0){
					return;
				}
				this.budge = this.budge.substr(0,this.budge.length-1);
			},
			clickKey(num){
				this.budge +=num+"";
			},
			openPopup(){
			    this.$refs.popup.open()
		    },
		    closePopup(){
			    this.$refs.popup.close()
			}
	    },
		watch:{
			visible(v){
				console.log(v)
				if(v){
					this.openPopup()
				}else{
					this.closePopup()
				}
			}
		}
	}
</script>

<style lang="scss">
	.budge{
		width:100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		.budge-text{
			width:10%;
			height:100upx;
			font-size: 50upx;
			line-height: 100upx;
			text-align: center;
			color:#808080;
		}
		.budge-input{
			width:90%;
			height: 100upx;
		}
	}
	.content{
		width:100%;
		height:600upx;
		border:1px solid #eaeaea;
		display:flex;
		flex-direction:row;
		justify-content:center;
		align-items:center;
		.key-content{
			width:70%;
			height:100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			.key{
				width:100%;
				height:25%;
				border-bottom: 1px solid #eaeaea;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				box-sizing:border-box;
				.keyText{
					width:33.3%;
					height:100%;
					border-right: 1px solid #eaeaea;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					color:#808080;
					font-size: 30upx;
					box-sizing:border-box;
					&:active{
						opacity:0.7;
					}
				}
			}
		}
		.button-group{
			width:30%;
			height:600upx;
			display: flex;
			flex-direction: column;
			.check-btn{
				width:100%;
				height: 50%;
				line-height: 300upx;
				border-radius: 0%;
				background: #FF775C;
				color:#FFF;
			}
			.delete-btn{
				width:100%;
				height:50%;
				display:flex;
				flex-direction:row;
				justify-content:center;
				align-items:center;
				.close{
					width:60upx;
					height:60upx;
				}
			}
		}
	}
</style>
