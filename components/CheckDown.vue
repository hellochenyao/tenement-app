<template>
	<view> 
		<text class="title textOverHide">{{btnValue}} </text>
		<text v-if="!selected" class="iconfont" >&#xe652;</text>
		<text v-if="selected" class="iconfont" >&#xe653;</text>    
	</view>
</template>  
 
<script>
	export default {  
		props: { 
			btnValue:{ 
				type: String,
				default: 'more'
			},
			selected:{
				type:Boolean,
				default:false
			}
		}, 
		components: {},
		data() {
			return {
				btnValuea:""
			};
		},
		onLoad(){
			
		}
	}
</script>
 
<style>
@font-face {
  font-family: 'iconfont';  /* project id 1231468 */
  src: url('//at.alicdn.com/t/font_1231468_s3ncnbn73w8.eot');
  src: url('//at.alicdn.com/t/font_1231468_s3ncnbn73w8.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1231468_s3ncnbn73w8.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1231468_s3ncnbn73w8.woff') format('woff'),
  url('//at.alicdn.com/t/font_1231468_s3ncnbn73w8.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1231468_s3ncnbn73w8.svg#iconfont') format('svg');
}
.iconfont{
    font-family:iconfont !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
.title{     
	width:100%;
	display: inline-block;
	font-size: 28upx;
}
</style>
