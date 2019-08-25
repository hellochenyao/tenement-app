export default (key)=>{
	try {
		const value = uni.getStorageSync(key);
		if (value) {
			return value;
		}else{
			return null;
		}
	} catch (e) {
		// error
		console.log(e);
		return false;
	}
}