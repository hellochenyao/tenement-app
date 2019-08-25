<template>
	<view class="top-select-bar">
		<view class="current-select-container" @tap="selectHandler(0)">
			<text class="top-item" :class="currentType==0?'checked':''">求租帖</text>
		</view>
		<view class="current-select-container" @tap="selectHandler(1)">
			<text class="top-item" :class="currentType==1?'checked':''" >房源帖</text>
		</view>
		<text :class="currentType==1?'changeChecked':''" class="selected-border"></text>
	</view>
</template>

<script>
	export default {
		data() { 
			return {
				currentType:0
			}
		},
		props: {
			current:Number,
			topHeight:String
		},
		components: {
		},
		onLoad(event) {
		},
		onShow(event){
		},
		methods: {
			selectHandler(type){
				console.log(type)
				this.currentType = type;
				this.$emit("changeCurrent",type);
			}
		},
		watch:{
			current(val){
				this.currentType = val;
			}
		}
	}
</script>

<style lang="scss">
	.top-select-bar{
		width:100%;
		height: 60upx;
		padding: 10upx;
		padding-left: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		z-index: 999;
		background: #FFF;
		.current-select-container{
			width:150upx;
			height:100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			position: relative;
			.top-item{
				font-size: 30upx;
				color:#111;
			}
			.checked{
				font-size: 32upx;
				font-weight: bold;
			}
		}
		.selected-border{
			width:130upx;
			height: 20upx;
			border-radius: 20px;
			background: $uni-app-other-color;
			position: absolute;
			left: 30upx;
			bottom:10upx;
			z-index: -999;
			transition: all 0.3s;
		}
		.changeChecked{
			left:180upx;
		}
	}
</style>
