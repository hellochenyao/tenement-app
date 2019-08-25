<template>
	<ss-select-city  :hotCitys="hotCitys" v-model="value" @on-select="onSelect"></ss-select-city>
</template>

<script>
	import ssSelectCity from '@/components/ss-select-city/ss-select-city.vue'
	export default {
		data() { 
			return {
				hotCitys: ['杭州', '天津', '北京', '上海', '深圳', '广州', '成都', '重庆', '厦门'],
				value: '杭州',
			}
		},
		components: {
			ssSelectCity,
		},
		onLoad(event) {
			
		},
		methods: {
			onSelect(city) {
			 var pages = getCurrentPages();
			 var currPage = pages[pages.length - 1]; //当前页面
			 var prevPage = pages[pages.length - 2]; //上一个页面
			 prevPage.setData({
				 isDoRefresh:true,
				 city
			 });
			 uni.navigateBack();
		    },
		}
	}
</script>

<style>
</style>
