<template> 
	<view v-if="popData.visible" class="pop-mask"> 
		<view class="pop-box">
			<view class="pop-action">
				<text @tap="cancelPicker" class="pop-action-cancel">取消</text>
				<text @tap="chosedVal" class="pop-action-affirm">确认</text>
			</view>
			<view class="pop-picker-box">  
				<view scroll-y class="pop-picker-box-item"> 
					<!-- <view @tap="clickPicker(0,pIndex,pItem);" :id="'pid'+pIndex" :class="pIndex === pChoseIndex?'pop-picker pop-picker2':'pop-picker'"  v-for="(pItem,pIndex) in budget" :key="pIndex">{{pItem}}</view> -->
					<view class="input-group"> 
						<input class="budget" placeholder="请输入您的预算" @input="confirmInput" :value="budget.value"/>   
						<text class="budget-type">元</text>
					</view>
				</view> 
			</view>
		</view>
	</view> 
</template>

<script>
	// const budget = ["500元-1000元","1000元-1500元","1500元-2000元","2000元-2500元","2500元-3000元"]
	export default {  
		props:['popData'],
		data() {
			return { 
				vNode:"",
				budget:{value:""},
			}; 
		},
		methods:{ 
			//取消 
			cancelPicker(){      
				this.$emit("choseVal",{ 
					budget:this.budget.value,
					visible:false
				});
			},
			chosedVal() {
				this.$emit("choseVal",{  
					budget:this.budget.value,
					visible:false
				});
			},
			confirmInput(e){     
				console.log(e.detail)
				this.budget.value=e.detail.value==""?0:e.detail.value
				;
			},
		}
	}
</script>

<style lang="scss">
	.pop-mask {
	  position: fixed;
	  left: 0;
	  top: 0;
	  width: 100%;
	  height: 100%;
	  z-index: 100000;
	  background: rgba(0, 0, 0, 0.5);
	}
	.input-group{   
		width:46%;
		height:160upx;
		margin: 90upx auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
	}
	.budget{
		padding-left: 10px;
		font-size: 14px;
		border-bottom:1px solid #eaeaea;
	}
	.pop-box {
	  background: #fff;
	  position: absolute;
	  left: 0;
	  bottom: 0;
	  width: 100%;
	  height: auto;
	}
	.pop-action {
	  font-size: 30rpx;
	  /*display: -webkit-box;
	  display: -webkit-flex;*/
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  justify-content: space-between;
	  padding: 25rpx 30rpx;
	  position: relative;
	}
	.pop-action:after {
	  content: " ";
	  position: absolute;
	  left: 0;
	  top: 0;
	  right: 0;
	  height: 1px;
	  border-top: 1px solid #eee;
	  color: #eee;
	  transform-origin: 0 0;
	  transform: scaleY(0.5);
	}
	.pop-action:before {
	  content: " ";
	  position: absolute;
	  left: 0;
	  bottom: 0;
	  right: 0;
	  height: 1px;
	  border-bottom: 1px solid #eee;
	  color: #eee;
	  transform-origin: 0 100%;
	  transform: scaleY(0.5);
	}
	.pop-action-cancel { 
      font-size:30upx;
	  color: #969696;
	}
	.pop-action-affirm {
	  font-size:30upx;
	  color: #00B26A;
	}
	.pop-picker-box {
	  /*display: -webkit-box;
	  display: -webkit-flex;*/
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  justify-content: flex-start;
	  padding-top: 10rpx;
	  padding-bottom: 10rpx;
	}
	.pop-picker-box-item {    
	  height: 430upx; 
	  overflow-y: hidden;
	  width: 33.333%;
	  padding-left: 20rpx;
	  padding-right: 20rpx;
	  box-sizing: border-box;
	}
	.pop-picker { 
	  font-size: 36rpx;
	  padding-top: 30rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	  line-height: normal;
	  padding-right: 30rpx;
	  box-sizing: border-box;
	  text-align: center;
	}
	.pop-picker-box {
	  /*display: -webkit-box;
	  display: -webkit-flex;*/
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  justify-content: flex-start;
	  padding-top: 10rpx;
	  padding-bottom: 10rpx;
	}
	.pop-picker-box-item {  
	  height: 430upx;
	  width: 100%;
	  padding-left: 20rpx;
	  padding-right: 20rpx;
	  box-sizing: border-box;
	}
	.pop-picker2 {
	  color: #e93b3d;
	  position: relative;
	}
	.pop-picker2:after {
	  content: '';
	  position: absolute;
	  right: 0;
	  top: 65%;
	  transform: translateY(-35%) rotate(-45deg);
	  width: 20rpx;
	  height: 10rpx;
	  border-left-width: 4rpx;
	  border-bottom-width: 4rpx;
	  border-left-style: solid;
	  border-bottom-style: solid;
	  border-left-color: #e93b3d;
	  border-bottom-color: #e93b3d;
	}
	.budget-type{
		margin-left: 10px;
		font-size:14px;
	}
</style>
