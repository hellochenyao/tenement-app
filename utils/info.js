export default {
	toast:(title,time=2000,icon='none')=>{ 
		uni.showToast({
			title,
			duration:time,
			icon
		});
	},
	loading:(title,mask=false)=>{
		uni.showLoading({
		    title,
			mask
		});
	},
	hideLoading:()=>{
		uni.hideLoading();
	}
}