<template>
	<view class="content"><zy-search :is-focus="false" @query="queryInvitation" :text="searchText" :city="city" :is-block="true" :show-want="false"></zy-search></view>
</template>

<script>
	import zySearch from '../../components/zy-search/zy-search.vue'
	export default {
		data() {
			return {
				current:0,
				city:"",
				searchText:""
			}
		},
		components: {
			zySearch
		},
		onLoad(event) {
			console.log(event)
			this.city = event.city;
			this.current = event.current;
			this.searchText = event.searchText
		},
		computed:{
		},  
		methods: {
			queryInvitation(param){
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				if(param.type==""){
					prevPage.setData({
						isDoSearch:true,
						detailLocation:param.text?param.text:"",
						title:""
					});
					uni.navigateBack();
					return
				}
				 prevPage.setData({
					 isDoSearch:true,
					 detailLocation:param.type=="title"?"":param.text,
					 title:param.type=="title"?param.text:""
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
