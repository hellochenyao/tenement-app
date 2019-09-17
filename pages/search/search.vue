<template>
	<view class="content"><zy-search :is-focus="false" @query="queryInvitation" :is-block="true" :show-want="false"></zy-search></view>
</template>

<script>
	import zySearch from '../../components/zy-search/zy-search.vue'
	export default {
		data() {
			return {
				current:0,
				city:""
			}
		},
		components: {
			zySearch
		},
		onLoad(event) {
			console.log(event)
			this.city = event.city;
			this.current = event.current;
		},
		computed:{
		},  
		methods: {
			queryInvitation(param){
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				 prevPage.setData({
					 isDoSearch:true,
					 detailLocation:param.type=="title"?"":param.text
				 });
				 uni.navigateBack();
			}
		},
		watch:{
		}
	} 
</script> 

<style>
	page{
		width:100%;
		min-height: 100%;
		background: #FFF!important;
	}
</style>
