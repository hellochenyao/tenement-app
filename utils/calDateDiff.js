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
		return "刚刚"
	}
	return dif + "分钟前";
} 
function formatDate(date,type){
	if(type==0){
		return (date.getHours()<10?"0"+date.getHours():date.getHours() )+ ":" +(date.getMinutes()<10?"0" +date.getMinutes():date.getMinutes());
	}
}
function format(date,fmt) { //author: meizz 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export{
	calloginDate,
	formatDate,
	format
}