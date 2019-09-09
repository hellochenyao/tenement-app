<template>
	 <view class="big-container">                    
        <view class="invitation_basic_container">    
		    <view :class="['invitation_check_group']" @tap="checkedHandler" data-type="1"> 
				<image class="list-icon" src="../../../static/images/add/定位.png"></image>  
				<check-down :btnValue="currentLoc.name" ></check-down> 
			</view>  
			<view :class="['invitation_check_group']" @tap="checkedHandler" data-type="2">  
				<image class="list-icon" src="../../../static/images/add/钱袋.png"></image> 
				<check-down :btnValue="budget > 0?budget+'元':'预算'" :selected="popData.visible"></check-down> 
			</view>   
			<picker mode="date" :value="indate.date" :start="startDate" :end="endDate" @change="bindDateChange" @cancel="cancelChange"> 
				<view :class="['invitation_check_group']" @tap="checkedHandler" data-type="3">   
				<image class="list-icon" src="../../../static/images/add/时间.png"></image> 
					<check-down :btnValue="indate.date!=''?indate.date:'期望入住时间'" :selected="inDateSelected"></check-down> 
				</view> 
			</picker>    
        </view>      
		<view class="detail-publish">  
		    <input v-if="!hideTitle" class="detail-title-input" placeholder="加个标题哟" placeholder-class="place-title" v-model="title" />
		    <textarea v-if="!popData.visible" class="detail-content-input detail-text" maxlength="500" placeholder="对房子室友 有什么要求"  v-model="content"/>
			<view v-if="popData.visible" class="detail-content-input detail-text">
				{{content}}
			</view> 
		</view> 
		<view class="check-container">  
		    <view class="check-content">  
				<switch class="check-btn" :checked="refuseMedium" color="#68bd91" @change="switchChange($event,0)"/>      
				<text class="check-name">是否拒绝中介</text>
			</view>
			<view class="check-content"> 
				<switch class="check-btn" :checked="allowCall" color="#68bd91" @change="switchChange($event,1)"/>
				<text class="check-name">是否允许直接打电话给我</text> 
			</view>
			<view class="check-content"> 
				<switch class="check-btn" :checked="showPersonalDetails" color="#68bd91" @change="switchChange($event,2)"/> 
				<text class="check-name">是否展示我的个人履历</text>
			</view>
		</view>  
		<view class="bottom-option-tab">
			<view class="option-button option-title" @tap="updateTitleState">
				<text>{{hideTitle?'添加标题':'隐藏标题'}}</text>
			</view>
			<view class="option-button option-publish">
				<button class="publish-btn" :disabled="publishBtnDisabled" :class="publishBtnDisabled?'forbid':'allow'"  @tap="publish" hover-class="none" plain >发布</button>
			</view>
		</view>
<!-- 		<publish-button 
			v-on:getUserInfoHandle="getUserInfo" 
			v-on:clickHandle="publish" 
			:publishBtnDisabled="publishBtnDisabled" 
			btnName="发布"
		/> -->
		<!--   <view class="date-container">
				<picker mode="date" :value="indate.date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{indate.date}}</view>  
				</picker>  
		   </view> --> 
		  <budge-component v-on:choseVal="popChoose"  :visible="popData.visible"></budge-component>
	 </view> 
</template>  
 
<script>   
	import info from "../../../utils/info.js"
	import RestApi from "../../../utils/restApi/index.js"
	import CheckDown from '../../../components/CheckDown.vue'
	import publishButton from '../../../components/publish-button/index.vue'
	import {  
	    mapState,  
	    mapMutations, 
		mapActions
	} from 'vuex';
	import getStorage from "../../../utils/getStorage.js"
	import  {qqmapsdk} from "../../../utils/QQMapWXConfig.js";
	import budgeComponent from "../../../components/budge-component/index.vue"
	export default { 
		components: {   
			CheckDown, 
			publishButton,
			budgeComponent
		},
		data() {
			return { 
				popData:{
					visible:false
				}, 
				currentLoc:{
					name:"期望地点",
					detail:"",
					latitude:"",
					longitude:"",
					city:"",
					district:""
				}, 
				region:"", 
				inDateSelected:false, 
				indate:{ 
					date:"" 
				}, 
				budget:"",
				refuseMedium:false,
				allowCall:false,
				showPersonalDetails:false, 
				title:"", 
				content:"",
				hideTitle:false
			}
		}, 
		computed: { 
			startDate() { 
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			publishBtnDisabled(){
				if(this.currentLoc.latitude&&this.currentLoc.longitude&&this.budget!=0&&this.indate.date&&this.content){
					return false;
				}
				return true;
			},
			...mapState({ 
				publishSuccess:state=>state.invitateStore.publishSuccess
			})
        },
		methods: { 
			checkedHandler(e){       
				var self = this; 
				if(e.currentTarget.dataset.type==1){    
					uni.chooseLocation({
						success: function (res) {
							qqmapsdk.reverseGeocoder({
								  location: { 
							           latitude: res.latitude,
									   longitude: res.longitude,
								  },
								  success: function(res) {//成功后的回调
								       self.currentLoc.city = res.result.address_component.city;
								       self.currentLoc.district = res.result.address_component.district;
								  },
								  fail:function(e){
									  console.log(e)
								  }
							})
							self.currentLoc.name = res.name;
							self.currentLoc.detail = res.address;
							self.currentLoc.latitude = res.latitude;
							self.currentLoc.longitude = res.longitude;
						},
					});
				}else if(e.currentTarget.dataset.type==2){
					this.budgetSelected = !this.budgetSelected;
					this.popOpen();
				}else if(e.currentTarget.dataset.type==3){ 
					this.inDateSelected = !this.inDateSelected; 
				}
		},
		popOpen(){
			this.popData.visible = true
		},
		popChoose(res){   
			this.budget = parseInt(res.budget); 
			this.popData.visible= res.visible;
		},
		getDate(type) {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (type === 'start') {  
                year = year;
            } else if (type === 'end') {
                year = year + 2;
            }
            month = month > 9 ? month : '0' + month;
            day = day > 9 ? day : '0' + day; 
            return `${year}-${month}-${day}`;
        },
		bindDateChange(e) {   
            this.indate.date = e.target.value;
			this.inDateSelected = false;
        }, 
		cancelChange(){  
			this.inDateSelected = false;
		}, 
		switchChange (e,type) {  
			if(type==0){
				this.refuseMedium = e.target.value;
			}else if(type==1){
				this.allowCall = e.target.value;
			}else{
				this.showPersonalDetails = e.target.value;
			}
        },
		publish(){ 
			let userId = getStorage('userId');
			if(userId){
				let postData={
					acceptedMedium:this.refuseMedium?1:0,
					allowCallMe:this.allowCall?1:0,
					showPersonalInfo:this.showPersonalDetails?1:0,
					desiredDate:this.indate.date,
					rental:this.budget,
					location:this.currentLoc.city+','+this.currentLoc.district,
					latitude:this.currentLoc.latitude+','+this.currentLoc.longitude,
					title:this.title,
					content:this.content,
					id:userId,
				};
				this.$store.dispatch("publishInvitation",postData); 
			}else{
				info.toast("请先登录");
			}
	    },
		_clearData(){
			this.currentLoc = {
				name:"期望地点",
				detail:"",
				latitude:"",
				longitude:""
			};
			this.indate = { 
				date:"" 
			};
			this.title = ""; 
			this.content = "";
			this.budget = 0;
		},
		updateTitleState(){
			this.hideTitle = !this.hideTitle;
		}
	},
	watch:{
		publishSuccess(val){
			if(val){
				this._clearData();
			}
		}
	}
}
</script>

<style lang="scss">  
    @font-face {
		font-family: 'iconfont';  /* project id 1202574 */
		src: url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.eot');
		src: url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.woff2') format('woff2'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.woff') format('woff'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.svg#iconfont') format('svg');
    }
	.big-container{
		padding-bottom: 100upx;
		margin-top: 20upx;
		width: 100%;
		overflow-x:hidden;
		overflow-y: auto;
		color: $uni-text-color;
	}
	.invitation_basic_container{         
		width:90%;
		margin: 10upx auto;
		padding:30upx 0;
		background-color: #FFFFFF;
		border-radius: 10upx;
		display: flex;
		flex-direction: row; 
		align-items: center;
		box-shadow: 1px 1px 5px #d6d6d6;
		.invitation_check_group{
			width:33%;
			text-align: center;
			&:last-child{
				width:100%;
			}
			&:active{
				opacity: $uni-app-active-btn-opacity;
			}
		}
	}
	.detail-publish{    
		width: 90%;
		margin:15upx auto; 
		background-color: #FFF;
		border-radius: 10upx;
		padding-top: 10upx; 
		box-shadow: 1px 1px 5px #d6d6d6;
		.detail-title-input{ 
			width:calc(100% - 30upx);
			font-size:28upx;
			padding:15upx 0 20upx 0; 
			margin:0 15upx;
			height:60upx;
			border: none;
			border-bottom: 1px solid #eaeaea;
		}
		.detail-content-input{     
			width:calc(100% - 30upx);
			padding:15upx 0 20upx 0; 
			margin:0 15upx;
			height:500upx;
			font-size:28upx; 
			border: none;
		} 
		
	}
	.check-container{   
		width:90%;
		margin:15upx auto;  
		height: 20%;
		padding: 10px 0;
		background-color: #FFF;
		border-radius: 10upx;
		box-shadow: 1px 1px 5px #d6d6d6;
		.check-content{
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			margin: 5px 5px 0 10px; 
			.check-name{ 
				font-size:28upx;
				color: $uni-text-color;
			}
			.check-btn{   
				margin-top: 6upx;
				transform:scale(0.7);
			}
		}
	}
	.list-icon{       
		width: 60upx;   
		height: 60upx; 
		text-align: center;
		font-family: iconfont; 
		margin-left: 20upx;
		margin-right: 20upx;
	}
	.place-title{
		font-size: 28upx;
		font-weight: 600;
	}
	.bottom-option-tab{
		width:100%;
		height:80upx; 
		position:fixed;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		border:1px solid #eaeaea;
		left:0;
		bottom:0;
		background: #FFF;
		z-index:100000;
		.option-button{
			width:200upx;
			display: flex;
			height: 50upx;
			padding:3upx 10upx;
			justify-content: center;
			align-items: center;
			border:1px solid #eaeaea;
			background: #eaeaea;
			font-size: 26upx;
			border-radius: 20px;
			margin:0 10upx;
			color:#000;
			.allow{
				color:$uni-app-basic-color; 
				&:active{
					opacity: 0.7;
				}
			}
			.forbid{
				color:#CCC;
			}
			.publish-btn{
				background: transparent;
				border: none!important;
				&after{
					border:none;
					border-radius:0
				}	
			}
			.publish-btn[disabled] {
				background: transparent !important;
				border-color:  none!important;
			}
		}
		.option-publish{
			border:transparent!important;
			background:transparent!important;
		}
	}
</style>
