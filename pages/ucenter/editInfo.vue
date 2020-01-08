<template>
	<view class="content">
		<view class="detail">
			<input maxlength="20" focus type="text" confirm-type="done"  v-model.trim="text"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text:""
			};
		},
		components: {cmdCellItem},
		methods:{
			goAdd(){
				uni.navigateTo({
					url:"./editInfo"
				});
			}
		}
	}
</script>

<style>
	.content{
		width:100%;
		height:100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.detail{
		width:90%;
		height: 300upx;
		background-color: #FFF;
	}
</style>
