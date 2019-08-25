<template>
	<view class="contain" :style="{borderTop:vid?'':'1px solid #eaeaea'}">
		<res-msg :msg="dat" @setCurrentSelect="setCurrentSelect"></res-msg>

		<view v-if="dat.resDetail.length!=0" class="response-msg-content" @tap="setCurrentSelect(dat)">
			<view class="res-msg" :key="index" v-for="(resMsg,index) in dat.resDetail">
				<text class="user">{{resMsg.nickname}}：</text>
				<text class="response-text">回复</text>
				<text class="user">{{resMsg.answerUserNickname}}：</text>{{resMsg.msg}}
			</view>
		</view>
	</view>
</template>

<script> 
	import ResMsg from "./resMsg";
	export default { 
		data() { 
			return {
				res:'',
				hideButton:false,
				msgRes:{},
			}
		},
		props:{ 
			dat:{},
			vid:Boolean,
			responseTo:Function
		},
		mounted() {
			
		},
		computed:{
		},
		components: {
			ResMsg
		},
		methods: {
			setCurrentSelect(data){
				this.$emit("setCurrentSelectMsg",data);
			}
		},
		watch:{
			dat(v){
				console.log(v,"aaa")
			}
		}
	}
</script>

<style lang="scss">
	.contain{
	}
	.response-msg-content{
		width:calc(100% - 90upx);
		margin-left: 90upx;
		min-height: 100upx; 
		margin-bottom: 70upx;
		background: rgb(240,240,240);
		opacity: 0.7;
		padding:10upx;
		box-sizing: border-box;
		.res-msg{
			width:100%;
			word-break: break-all;
			font-size: 26upx;
			.user{
				width:30%;
				height: 20px;
				font-size: 26upx;
				color:#1796f9;
			}
			.response-text{
				margin-right: 1upx;
			}
		}
	}
</style>
