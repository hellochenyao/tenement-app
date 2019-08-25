function calHourDiff(fromDate,to){
	var dif = to.getTime() - fromDate.getTime();
	console.log(dif)
	if(dif<0){
		return 0;
	}
	return Math.floor(dif/1000/60/60);
}
function calDateDiff(fromDate,to){
	var dif =to.getTime() - fromDate.getTime();
	if(dif<0){
		return 0;
	}
	return Math.floor(dif/1000/60/60/24);
}
function calMinDiff(fromDate,to){
	var dif =to.getTime() - fromDate.getTime();
	if(dif<0){
		return 0;
	}
	return Math.floor(dif/1000/60); 
}
function calloginDate(loginDate,to){
	var dif = calDateDiff(loginDate,to);
	if(dif>=1){
		return dif + "天前";
	}
	dif = calHourDiff(loginDate,to);
	if(dif>=1&&dif<=60){
		return dif + "小时前";
	}
	dif = calMinDiff(loginDate,to);
	if(dif == 0 ){
		return "刚"
	}
	return dif + "分钟前";
} 

export{
	calloginDate
}