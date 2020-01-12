<template> 
     <view>
		<cmdCellItem title="昵称" :addon="user.nickName" arrow @tap="goAdd(0)"></cmdCellItem> 
		<picker @change="changeGende" :value="user.gender"
		        :range="genType">
		    <cmdCellItem title="性别" :addon="user.gender==0?'男':'女'" arrow></cmdCellItem> 
		</picker>
		<cmdCellItem title="手机号" :addon="user.phone" arrow @tap="goAdd(4)"></cmdCellItem> 
		<cmdCellItem title="职业" :addon="user.occupation" arrow @tap="goAdd(1)"></cmdCellItem> 
		<cmdCellItem title="微信号" :addon="user.weChat" arrow @tap="goAdd(2)"></cmdCellItem> 
		<cmdCellItem title="学校" :addon="user.school" arrow @tap="goAdd(3)"></cmdCellItem> 
	<!-- 	<text class="message"></text>
		<text class="message"></text>
		<text class="message">*为了找到合适的房子,建议及时完善信息</text> -->
	 </view>
</template>

<script>
	import getStorage from "../../utils/getStorage.js"
	import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
	import {
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				genType:["男","女"]
			};
		},
		components: {cmdCellItem},
		computed: {
		    ...mapState({
		    	user:state=>{
					return state.userStore.userInfo
				}
		    })
		},
		onLoad() {
			this.getInfo();
		},
		methods:{
			goAdd(type){
				let value = "";
				if(type==0){
					value = this.user.nickName;
				}
				if(type==1){
					value = this.user.occupation?this.user.occupation:"";
				}
				if(type==2){
					value = this.user.weChat?this.user.weChat:""
				}
				if(type==3){
					value = this.user.school?this.user.school:""
				}
				if(type==4){
					value = this.user.phone?this.user.phone:""
				}
				uni.navigateTo({
					url:"./editInfo?editType="+type+"&value="+value
				})
			},
			getInfo(){
				let userId = getStorage('userId');
				this.$store.dispatch("requestUserInfo",{userId})
			},
			changeGende(e){
				console.log(e)
				this.modify({gender:e.detail.value});
			},
			modify(info){
				let userId = getStorage('userId');
				this.$store.dispatch("modifyUserInfo",{userId,...info})
				.then(res=>{
					console.log(res)
					this.getInfo()
				})
				.catch(e=>{
					console.log(e)
				})
			}
		}
	}
</script>

<style>
	input{
		width:100%;
		box-sizing: border-box;
		background: #F7F7F7;
		height: 70upx;
		padding-left: 20upx;
		line-height: 70upx;
		font-size: 30upx;
	}
	.message{
		font-size: 27upx;
		color:#FF3333;
		margin-top: 60upx;
	}
</style>
