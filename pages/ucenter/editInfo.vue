<template>
	<view class="content">
		<view class="detail">
			<text class="title">{{name}}</text>
			<input maxlength="20" class="edit" focus type="text" confirm-type="done"  v-model.trim="text"/>
		</view>
		<button class="check" @tap="edit()">确定</button>
	</view>
</template>

<script>
	import getStorage from "../../utils/getStorage.js"
	export default {
		data() {
			return {
				text:"",
				name:""
			};
		}, 
		onLoad(e) {
			this.text = e.value
			if(e.editType == 0){ 
				this.name = "昵称";
			}
			else if(e.editType == 1){
				this.name = "职业"
			}else if(e.editType ==2){
				this.name = "微信号"
			}else if(e.editType ==3){
				this.name = "学校"
			}else if(e.editType ==4){
				this.name = "手机号"
			}
		},
		methods:{
			// goAdd(){
			// 	uni.navigateTo({ 
			// 		url:"./editInfo"
			// 	});
			// }
			modify(info){
				let userId = getStorage('userId');
				this.$store.dispatch("modifyUserInfo",{userId,...info})
				.then(res=>{
					console.log(res)
					this.getInfo()
					uni.navigateBack()
				})
				.catch(e=>{
					console.log(e)
				})
			},
			edit(){
				if(this.name == "昵称"){
					this.modify({nickName:this.text})
				}else if(this.name == "职业"){
					this.modify({occupation:this.text})
				}else if(this.name == "微信号"){
					this.modify({weChat:this.text})
				}else if(this.name == "学校"){
					this.modify({school:this.text})
				}else if(this.name == "手机号"){
					this.modify({phone:this.text})
				}
			},
			getInfo(){
				let userId = getStorage('userId');
				this.$store.dispatch("requestUserInfo",{userId})
			}
		}
	}
</script>

<style>
	.content{
		flex:1;
		width:100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position:absolute;
	}
	.detail{
		width:85%;
		height: 300upx;
		background-color: #FFF;
		border-radius: 10upx;
		box-shadow: 1px 1px 5px #d6d6d6;
		padding:30upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.title{
		font-size: 36upx;
		font-weight: bold;
		color:#1E1E1E;
	}
	.edit{
		width:100%;
		height:100upx;
		line-height:100upx;
		border-bottom: 1px solid #eaeaea;
		margin-top: 30upx;
	}
	.check{
		width:500upx;
		height:90upx;
		line-height: 90upx;
		background-color: #59c298;
		color:#FFF;
		margin-top: 60upx;
	}
</style>
