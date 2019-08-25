export default {
	toast:(title,time=2000,icon='none')=>{ 
		uni.showToast({
			title,
			duration:time,
			icon
		});
	}
}