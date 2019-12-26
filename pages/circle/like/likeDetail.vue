<template>
<view> 
	<view class="toolbar">
		<view class="like" v-on:click.stop="like()">
			<image :src="!isLike?'../../../static/images/index/islike.png':'../../../static/images/index/like.png'"></image>
		</view>
		<view class="comment" v-on:click.stop="comment()">
			<image src="../../../static/images/index/comment.png"></image>
		</view>
	</view> 
	<!-- 赞／评论区 -->
	<view class="post-footer" v-if="!showLike"> 
		<view class="footer_content">
			<image class="liked" src="../../../static/images/index/liked.png"></image>
			<text class="nickname" v-for="(user,index_like) in data" :key="index_like">{{user.userName}}</text>
		</view>
		<view class="footer_content" v-for="(comment,comment_index) in comments" :key="comment_index" v-on:click.stop="reply(comment)">
			<text class="comment-nickname">{{comment.userName}}: <text class="comment-content">{{comment.content}}</text></text>
		</view>
	</view>
</view>
</template>

<script>
	import getStorage from "../../../utils/getStorage.js"
	import info from "../../../utils/info.js"
	export default {
		data() {
			return {
				data:[],
				isLike:false,
				comments:[]
			}
		},
		props:{
			dynamicId:0,
			isChange:false,
			timestamp:"",
			postIndex:0,
			isChangeComent:false,
			showLike:false
		},
		mounted() {
			if(!this.showLike){
				this.getLikeDetail()
				this.getComent()
			}
		},
		onUnload() {
		
		},
		methods: {
			getLikeDetail(){
				let userId = getStorage('userId');
				this.$store.dispatch("getLikeDetail",{userId,dynamicId:this.dynamicId,pageNo:1,pageSize:10})
				.then(res=>{
					this.data = res.data
				}).catch(e=>{console.log(e)})
			},
			comment(){
				this.$emit("comment",this.postIndex);
			},
			reply(comment) {
				this.$emit("reply",{comment,dynamicId:this.dynamicId});
			},
			like(){
				this.$emit("like",this.dynamicId);
			},
			getState(){
				let userId = getStorage('userId');
				let dynamicId = this.dynamicId
				console.log(dynamicId)
				this.$store.dispatch("getState",{userId,dynamicId})
				.then(res=>{
					console.log(res)
					this.isLike = res;
				})
				.catch(e=>{
					console.log(e)
					info.toast(e.msg)
				});
			},
			getComent(){
				let userId = getStorage('userId');
				let dynamicId = this.dynamicId
				this.$store.dispatch("getComent",{userId,dynamicId,pageNo:1,pageSize:3})
				.then(res=>{
					console.log(res)
					this.comments = res.comments
				})
				.catch(e=>{
					console.log(e)
					info.toast(e.msg)
				});
			}
		},
		watch:{
			isChange(v){
				console.log(v)
				this.getLikeDetail()
				this.getState()
				
			},
			isChangeComent(v){
				this.getComent()
			},
			dynamicId(v){
				this.getState()
			}
		}
	}
</script>
  
<style scoped lang="scss"> 
.liked{
	position: relative;
	margin-right: 10upx;
	width: 34upx;
	height: 34upx;
}

	.toolbar {
		position: relative;
		top: 10upx;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		margin-top:10upx;
		margin-bottom: 30upx;
	}
	
	.toolbar .timestamp {
		color: #757575;
		font-size: 22upx;
	}
	
	.like {
		width: auto;
		height: auto;
		position: absolute;
		right: 60upx;
		display: flex;
		align-items: center;
	}
	.comment {
		width: auto;
		height: auto;
		position: absolute;
		right: 0upx;
		display: flex;
		align-items: center;
	}
	.toolbar image{
		padding-left: 20upx;
		width: 40upx;
		height: 40upx;
	}
	
	.post-footer{
		margin-top: 40upx;
		background-color: #f3f3f5;
		width: 100%;
	}
	
	.footer_content {
		padding-left: 10upx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		margin-top: 5upx;
		padding-left:10upx;
		padding-bottom:10upx;
		&:first-of-type{
			margin-bottom: 20upx;
			padding:0;
		}
	}
	
	.footer_content .nickname {
		color: #36648B;
		font-size: 24upx
	}
	
	.footer_content .comment-nickname {
		color: #36648B;
		font-size: 24upx
	}
	
	.footer_content .comment-content {
		color: #000000;
		font-size: 24upx
	}
	
	.foot {
		position: fixed;
		width: 100%;
		height: 90upx;
		min-height: 90upx;
		left: 0upx;
		bottom: 0upx;
		overflow: hidden;
	}
</style>
