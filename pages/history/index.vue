<template>
	<view>
		<view class="chooseInvitation">
			<text class="chooseText">只看回复过的</text>
			<switch color="#59C298" :style="{transform:'scale(0.7)'}" :checked="isHaveResponse" @change="switchChange" />
		</view>
		<invitation-component v-for="(item,index) in dataList" :dat="item" :showType="'history'"></invitation-component>
		<uni-load-more :loadingType="1" :status="downMoreStatus" :content-text="downMoreOptions"></uni-load-more>
	</view>
</template>

<script>
	import InvitationComponent from "../../components/invitation-component/index.vue";
	import RestApi from "../../utils/restApi/index.js";
	import getStorage from "../../utils/getStorage.js"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import {  
	    mapState,  
	    mapMutations, 
		mapActions 
	} from 'vuex';
	
	export default {
		data() {
			return {
				downMoreStatus:"loading",
				dataList:[],
				downMoreOptions:{
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "暂无更多记录"
				},
				pageNo:1,
				pageSize:10,
				total:0,
				isHaveResponse:false
			}
		},
		components: {
			InvitationComponent,
			uniLoadMore
		},
		computed:{
			...mapState({ 
				
			})
		}, 
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {

		},
		onLoad(event) {
			this.getHistory();
		},
		onReachBottom(){
			this.downReachBottom()
		},
		onShow(event) {	
		},
		methods: {
			downReachBottom(){
				let pageNo = this.pageNo;
				let pageSize = this.pageSize;
				if(this.changeDownMoreStatus()){
					return;
				}
				this.getHistory();
			},
			getHistory(status){
				let userId = getStorage("userId")
				let pageNo = this.pageNo;
				let pageSize = this.pageSize;
				let postData = {userId,pageNo,pageSize};
				postData["isHaveResponse"] = this.isHaveResponse;
				this.$store.dispatch("getBrowsingInvitation",postData)
				.then(res=>{
					if(res.data.length==this.pageSize){
						this.pageNo = this.pageNo+1;
					}
					this.dataList = this.dataList.concat(res.data);
					this.total = res.total;
					this.changeDownMoreStatus()
				})
				.catch(e=>{
					console.log(e)
				})
			},
			changeDownMoreStatus(){
				if(this.dataList.length >= this.total){
					this.downMoreStatus = "noMore";
				}else{
					this.downMoreStatus = "loading"
				}
				if(this.downMoreStatus == "noMore"){
					return true;
				}
				return false
			},
			switchChange(e){
				console.log(e)
				this.isHaveResponse = e.detail.value;
				this.pageNo=1;
				this.dataList = []
				this.downReachBottom()
			}
		},
	watch:{
	}
	}
</script>

<style lang="scss">
	.chooseInvitation{
		width:100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		.chooseText{
			font-size:26upx;
		}
	}
</style>
