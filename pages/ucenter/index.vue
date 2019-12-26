<template> 
	<uni-list>
	    <uni-list-item title="标题文字" :show-arrow="false"></uni-list-item>
	    <uni-list-item title="标题文字"></uni-list-item>
	    <uni-list-item title="标题文字" :show-badge="true" badge-text="12"></uni-list-item>
	    <uni-list-item title="禁用状态" :disabled="true" :show-badge="true" badge-text="12"></uni-list-item>
	</uni-list>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	export default {
		data() {
			return {
	
			};
		},
		components: {uniList,uniListItem},
		methods:{
		}
	}
</script>

<style>
</style>
