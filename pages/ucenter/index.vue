<template> 
     <view>
		<cmdCellItem title="昵称" addon="Slimmer" arrow @tap="goAdd"></cmdCellItem> 
	 </view>
</template>

<script>
	import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
	export default {
		data() {
			return {
	
			};
		},
		components: {cmdCellItem},
		methods:{
			goAdd(){
				
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
</style>
