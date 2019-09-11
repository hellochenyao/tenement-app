import config from '../config_utils.js'
export default (() => { 
    let aopFn = null;
    let refreshNewToken = null;

    return {
        init(callback, refreshToken) {
            aopFn = callback;
            refreshNewToken = refreshToken;
        },
        request(url, parameters, method, isValidateJwt,) { 
            // console.log("parameters:",parameters);
            let head = null;
            method = method.toUpperCase();
            if (method == 'POST' || method == 'PUT' || method == 'PATCH'|| method == 'DELETE') { 
                head = {
                    method: method,
                    header: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': ''
                    }, 
                    data: JSON.stringify(parameters || {}),
                }
            } else {
                if (parameters) {
                    let paramsArray = [];
                    //拼接参数

                    Object.keys(parameters).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(parameters[key])));
                    if (url.search(/\?/) === -1) {
                        url += '?' + paramsArray.join('&')
                    } else {
                        url += '&' + paramsArray.join('&')
                    }
                }
                head = {
                    method: method,
                    header: {
                        'Content-Type': 'application/text;charset=utf-8',
                    }
                } 
            }
            isValidateJwt=isValidateJwt===false?isValidateJwt:true; 
            return refreshNewToken(isValidateJwt).then((jwt) => {   
                head.header.Authorization = jwt;
                let isSuccess=true; 
				url = config.requestUrl + url;
                return uni.request({url, ...head}).then(function (response) { 
					let [err,data] = response;
					if(err!=null){
						isSuccess = false;
						return {code:"error",msg:err.errMsg};
					}
                    if (data.statusCode !== 200) {
                        isSuccess = false;
                    }
                    return data.data; 
                }).then(function (res) { 
                    if (!isSuccess) {
                        //异常信息会存在code和msg中，后端封装的
                        throw res;
                    }
                    if (res != null && res.length > 0) {
                        return JSON.parse(res);
                    }
                    return res;
                }).then(function (rs) {
                    if (aopFn) {
                        return aopFn(rs);
                    }
                    return rs;
                }).catch(function (error) { 
					if (aopFn) {
					    return aopFn(error);
					}
                    throw error;
                });
            });

        },

    }
})();
