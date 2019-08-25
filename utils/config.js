let getNodeHeight = (id) => {
	return new Promise((res, rej) => {
		// #ifdef MP-WEIXIN
		uni.createSelectorQuery().select("#"+id).fields({size:true},data=>{
			console.log(data)
			res(data.height)
		}).exec()
		// #endif
		//#ifndef MP-WEIXIN
		uni.createSelectorQuery().select("#"+id).fields({size:true},data=>{
			res(data.height)
		}).exec()
		// #endif
		})
}
let getSystem = ()=>{
	return new Promise((res,rej)=>{
		uni.getSystemInfo({
			success(data) {
				return res(data);
			},
			fail(e) {
				return rej(e)
			}
		})
	})
}
export {
	getNodeHeight,
	getSystem
}