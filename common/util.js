function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前', 
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

function forMatNum(num){
	return num<10?'0'+num:num+'';
}

function initDays(year,month){
	let totalDays=new Date(year,month,0).getDate();
	let dates=[];
	for(let d=1;d<=totalDays;d++){
		dates.push(forMatNum(d));
	};
	return dates;
}
function initPicker(start,end,mode="date",step) {
	let initstartDate=new Date(start);
	let endDate=new Date(end);
	let startYear=initstartDate.getFullYear();
	let startMonth=initstartDate.getMonth();
	let endYear=endDate.getFullYear();
	let years=[],months=[],days=[],hours=[],minutes=[],seconds=[];
	let totalDays=new Date(startYear,startMonth,0).getDate();
	for(let s=startYear;s<=endYear;s++){
		years.push(s+'');
	};
	for(let m=1;m<=12;m++){
		months.push(forMatNum(m));
	};
	for(let d=1;d<=totalDays;d++){
		days.push(forMatNum(d));
	}
	for(let h=0;h<24;h++){
		hours.push(forMatNum(h));
	}
	for(let m=0;m<60;m+=step*1){
		minutes.push(forMatNum(m));
	}
	for(let s=0;s<60;s++){
		seconds.push(forMatNum(s));
	}
	switch(mode){
		case "date":
			return {years,months,days}
			break; 
		case "yearMonth":
			return {years,months}
			break;
		case "dateTime":
			return {years,months,days,hours,minutes,seconds}
			break;
		case "time":
			return {hours,minutes,seconds}
			break;			
	}
}

export {
	friendlyDate,
	initDays,
	initPicker
}
