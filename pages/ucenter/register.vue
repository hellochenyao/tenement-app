<template>
	<view class="s-page-wrapper">
		<view class="is-33vh has-mgt-10">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../../static/img/common/banner.jpg" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="registercontent">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input type="number" maxlength="11" placeholder="请输入帐号" class="is-input1 " />
				</view>
				<!-- <view class=" has-mgtb-10 ">
					<input type="number" maxlength="6" placeholder="短信验证码" class="is-input1 " />
					<view class="codeimg" @tap="getsmscode">{{smsbtn.text}}</view>
				</view> -->
				<view class=" has-radius has-mgtb-10">
					<input placeholder="请输入登录密码" :password="true" class="is-input1" />
				</view>
				<view class=" has-radius has-mgtb-10">
					<input placeholder="请再次输入登录密码" :password="true" class="is-input1" />
				</view>
				<view class=" registerbtn">
					<button :loading="reg.loading" @tap="regHandler"> {{ reg.loading ? "注册中...":"注 册"}} </button>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timerId: null,
				reg:{
					loading:false
				}
			};
		},
		methods: {
			// getsmscode: function() {
			// 	if (this.smsbtn.status == true ) {
			// 		console.log('message：', "别着急！短信已经发送了~");
			// 		return false;
			// 	}
			// 	this.smsbtn.status = true; // 这段代码其实应该加在你request请求 短信发送成功后 
			// 	this.timerId = setInterval(() => {
			// 			var codeTime = this.smsbtn.codeTime;
			// 			codeTime--;
			// 			this.smsbtn.codeTime = codeTime;
			// 			this.smsbtn.text = codeTime + "S";
			// 			if (codeTime < 1) {
			// 				clearInterval(this.timerId);
			// 				this.smsbtn.text = "重新获取";
			// 				this.smsbtn.codeTime = 60;
			// 				this.smsbtn.status = false;
			// 			}
			// 		},
			// 		1000);
			// 	return false;
			// }
			regHandler(){
				
			}
		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.registercontent {
		width: 85%;
		margin: 0 auto;
	}

	.logoimg {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
	}

	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding-left: 12rpx;
		padding-right: 12rpx;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border-bottom: 1rpx solid #e5e5e5;
		box-shadow: none;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}

	.iconfont {
		position: absolute;
		font-size: 40rpx;
		right: 12%;
		z-index: 999;
		width: 105rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.codeimg {
		position: absolute;
		font-size: 28rpx;
		right: 12%;
		z-index: 999;
		width: 200rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.registerbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: linear-gradient(160deg, #25e485 20%,#38a240 80%);
		opacity: 0.8;
	}

	button:after {
		border: 2rpx solid #f2f2f2;
	}
</style>
