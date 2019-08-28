<template>
	<view class="s-page-wrapper">
		<view class="is-33vh has-mgt-10">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../../static/img/common/banner.jpg" class="logoimg"></image>
			</view>
		</view>
		<view class="content">
			<view class="has-mglr-10 "> 
				<view class=" has-mgtb-10 ">
					<input type="number" maxlength="11" v-model="login.phone" placeholder="请输入帐号" class="is-input1 " @input="BindInput" data-val="phone" />
				</view> 
				<view class=" has-radius has-mgtb-10">
				    <input v-model="login.password" placeholder="请输入登录密码" class="is-input1"  @input="BindInput" data-val="password"/>
				</view>

				<view class=" loginbtn has-radius has-mgtb-20">
					<button :loading="login.loading" @tap="defaultHandlerLogin"> {{ login.loading ? "登录中...":"登 录"}} </button>
				</view>
			</view>
		</view>
		<view class="is-20vh has-mgt-80 content">
			<navigator url="#" class=" has-radius is-right is-grey has-mgr-20" hover-class="">
				<text>没有账号？</text><text @tap="goToReg" class="is-blue">点击注册</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login: {
					loading: false,
					phone:"",
					password:""
				},

			};
		},
		methods:{
			defaultHandlerLogin:function(){
				this.login.loading = true;
				setTimeout((e=>{
					this.login.loading = false;
				}),1500);
			},
			BindInput:function(e){
				var dataval = e.currentTarget.dataset.val;
				this.login[dataval] = e.detail.value; 
			},
			goToReg(){
				uni.navigateTo({
					url:"./register"
				})
			}
		}
	}
</script>

<style lang="scss"> 
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.content {
		width: 85%;
		margin: 0 auto;
	}

	.loginbtn button {
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
</style>
