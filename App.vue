<script>
	import getStorage from "./utils/getStorage.js";
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			const userId = uni.getStorageSync('userId');
			if(userId){
				this.$store.dispatch("updateLastLogin",{userId});
			}
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./static/css/simplepro.css";
	page{
		/* background-color: #f7f7f7; */
	}
	.container{ 
		width:100%;
		height:100%;
		position: absolute;
	}
	/*文字过长*/
	.textOverHide{  
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	} 
	uni-input div{ 
		width: 97%;
	}
	uni-button[disabled]:not([type]), uni-button[disabled][type=default]{
		background: #eee!important;
		border: 1px solid #eee;
	}
	button[disabled]{
		background: #eee!important;
		border: 1px solid #eaeaea;
	}
	.roll-wrap{
		width:100%;
		overflow-y:auto;
		overflow-x:hidden;
	}
</style>
