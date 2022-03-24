/**
* 用户相关服务 登陆，检查登录态
*/
const api = require('./api.util.js');  // 这里是本人对统一接口地址封装
let app =  getApp();

// import { Decrypt, Encrypt } from './CryptoJS.js';
/**
* Promise封装登录接口
* 判断本地缓存是否有sessionKey
* 有的情况下判断它是否过期
* **如果微信服务器没过期，继续从开发者服务器校验是否过期
* ****如果没过期，跳过登录，过期则调用登录接口
* **如果微信服务器登录态过期，则调用登录接口
* 没有则说明无登录态，调用登录接口
*/
const login = (userInfo,signature) => {
    return new Promise((resolve, reject) => {
        wx.setStorageSync('signature',signature)
        let sessionKey = wx.getStorageSync(`${signature}_sessionKey`)
        if (sessionKey) {
            console.log('sessionKey不为空')
            _checkWXSession() //检查用户的登录态在微信服务端是否过期
            .then((res) => {
                console.log('微信后台未过期>>>开始检测开发者服务器登录态')
                return _getUserInfo(signature)
            }).then(res => {
                console.log('sessionKey校验通过')
                resolve(res)
            })
            .catch((res) => {
                console.log('sessionKey校验未通过，过期了')
                _wxLogin().then(res => {
                    return _serLogin(res.code,userInfo)
                }).then((data) => {
                    console.log('登录后的数据',data)
                    resolve(data)
                })
            })
        } else {
            console.log('sessionKey为空，先微信服务器登录，再进行开发者服务器登录')
            _wxLogin().then(res => {
                console.log(res)
                return _serLogin(res.code,userInfo)
            }).then((data) => {
                console.log('登录后的数据',data)
                resolve(data)
            })
        }
    })
}




/**
* Promise封装wx.checkSession(),检查微信服务器登录态是否过期
*/
function _checkWXSession() {
	return new Promise((resolve, reject) => {
		wx.checkSession({
			success: () => {
				resolve(true)
			},
			fail: () => {
				reject(false)
			}
		})
	})
}

/**
* Promise封装wx.login
*/
function _wxLogin() {
	return new Promise((resolve, reject) => {
		wx.login({
			success: (res) => {
				if (res.code) {
					resolve(res);
				} 
				else {
					reject(res);
				}
			},
			fail: (err) => {
				reject(err);
			},
            complete: (res)=>{
               console.log(res)
            }
		})
	})
}

/**
* Promise封装wx.login
*/
function _getUserInfo(signature) {
    let openId = wx.getStorageSync(`${signature}_openid`);
	return new Promise((resolve, reject) => {
		wx.request({
			url:`${api.baseURL}${api.getOpenId}/${openId}`,
			data: {},
            method: 'get',
            success: function(res) {
                console.log('获取成功的回调')
                resolve(res.data)
            },
            fail: (err) => {
				reject(err);
			}
        })
	})
}

/**
* Promise封装开发者服务器登陆（获取登录后的sessionKey）
*/
function _serLogin(code,userInfo) {
    // console.log(code)
	return new Promise((resolve, reject) => {
		wx.request({
			url:api.baseURL + api.login,
			data: {
                code: code,
                nickname:userInfo.nickName,
                userImg:userInfo.avatarUrl
			},
            method: 'post',
            success: function(res) {
                console.log('登录成功的回调')
                resolve(res.data)
            },
            fail: (err) => {
				reject(err);
			}
        })
	})
}

module.exports = {
    login,
    _wxLogin,
    _serLogin
}