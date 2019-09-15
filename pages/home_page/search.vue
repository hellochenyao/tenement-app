<template>
	<view><zy-search></zy-search></view>
</template>

<script>
	import zySearch from "../../components/zy-search/zy-search.vue"
	import {
	    mapState,   
	    mapMutations, 
		mapActions
	} from 'vuex';
	export default { 
		data() { 
			return {
			}
		},
		props:{ 
		},
		mounted() {
			
		}, 
		computed:{
		},
		components: {
			zySearch
		},
		methods: {
		
		},
		watch:{
		}
	}
</script>

<style>
</style>
