export default {   
	uploadFileUrl : "http://182.61.48.161:8080/images/",//本地    
	requestUrl : "http://182.61.48.161:8080/api",
	wbUrl:"182.61.48.161:8080/ws",
	imagesUrl:"http://182.61.48.161:8080/images/app/"
}  
//户型
const layout = [["1室","2室","3室","4室","5室","6室","7室","8室","9室"],["0厅","1厅","2厅","3厅","4厅","5厅","6厅","7厅","8厅","9厅"],["0卫","1卫","2卫","3卫","4卫","5卫","6卫","7卫","8卫","9卫"]];
const rentType = ["整租","主卧","次卧","床位"];
const enterNums = [];
for(var i = 0;i <= 49;i++){
	enterNums.push(i+"人");
} 
export{
	layout, 
	rentType,
	enterNums
}