var config = require('./api.util');
var util = require('./common.util');

// 请求参数处理
const requestParam = (data, method) => {
  var str = '';
  if (method == 'post') {
    str = JSON.stringify(data);
    return str;
  } else if (method == 'get') {
    for (var i in data) {
      str += i + '=' + data[i] + '&';
    }
    str = str.length > 0 ? str.substring(0, str.length - 1) : '';
    return encodeURI(str);
  }
};
// 重新登录
// async function loginAgain(url, data){
//   let userId = wx.getStorageSync('userId')
//   let isLogin = await httpPost(config.userIdLogin,{
//     users_id:userId
//   })
//   if(isLogin.code == 200){
//     wx.setStorageSync('userId', isLogin.data.userId)
//     wx.setStorageSync('phoneNumber', isLogin.data.phoneNumber)
//   }
// }


// 封装post请求（url:请求接口； data：请求参数；）
const httpPost = (url, data) => {
  let token = wx.getStorageSync('token');
  var header = {
    'token':token
  };
  var params = requestParam(data, 'post');
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: config.baseURL + url,
      header: header,
      method: 'POST',
      data: params,
      success: function(res) {
          if (res.statusCode == 200) {
            
            resolve(res.data);
          }else if(res.statusCode == 401){
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('token');
            wx.showToast({
              title: '登录信息失效请重新授权登录',
              icon:'none'
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/mine/mine'
              });
            },1500)
          }else{
              console.log('============post 请求失败：============');
              console.error(
                '接口地址: ',
                '【 ' + config.baseURL + url + ' 】'
              );
              console.error('请求参数: ', params);
              console.error('返回结果: ', res);
              wx.showToast({
                title: res.data.emsg,
                icon: 'none',
                duration: 3000,
                mask: true
              });
          }
        reject(res);
      },
      fail: function(res) {
        console.log(res.data)
        console.log('============post 请求失败：============');
        console.error(
          '接口地址: ',
          '【 ' + config.baseURL + url + ' 】'
        );
        console.error('请求参数: ', params);
        console.error('返回结果: ', res);
        
        reject(res);
      }
    });
  });
  return promise;
};

// 封装put请求（url:请求接口； data：请求参数；）
const httpPut = (url, data) => {
    let token = wx.getStorageSync('token');
    var header = {
      'token':token
    };
    var params = requestParam(data, 'post');
    var promise = new Promise((resolve, reject) => {
      //网络请求
      wx.request({
        url: config.baseURL + url,
        header: header,
        method: 'PUT',
        data: params,
        success: function(res) {
            if (res.statusCode == 200) {
              
              resolve(res.data);
            }else if(res.statusCode == 401){
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
              wx.showToast({
                title: '登录信息失效请重新授权登录',
                icon:'none'
              })
            }else{
                console.log('============post 请求失败：============');
                console.error(
                  '接口地址: ',
                  '【 ' + config.baseURL + url + ' 】'
                );
                console.error('请求参数: ', params);
                console.error('返回结果: ', res);
                wx.hideLoading()
                wx.showToast({
                  title: res.data.emsg,
                  icon: 'none',
                  duration: 3000,
                  mask: true
                });
            }
          reject(res);
        },
        fail: function(res) {
          console.log(res.data)
          console.log('============post 请求失败：============');
          console.error(
            '接口地址: ',
            '【 ' + config.baseURL + url + ' 】'
          );
          console.error('请求参数: ', params);
          console.error('返回结果: ', res);
          
          reject(res);
        }
      });
    });
    return promise;
};

// 封装delete请求（url:请求接口； data：请求参数；）
const httpDel = (url, data) => {
  let token = wx.getStorageSync('token');
  var header = {
    'token':token
  };
  var params = requestParam(data, 'post');
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: config.baseURL + url,
      header: header,
      method: 'DELETE',
      data: params,
      success: function(res) {
          if (res.statusCode == 200) {
            resolve(res.data);
          }else if(res.statusCode == 401){
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('token');
            wx.showToast({
              title: '登录信息失效请重新授权登录',
              icon:'none'
            })
          }
        reject(res);
      },
      fail: function(res) {
        console.log(res.data)
        console.log('============post 请求失败：============');
        console.error(
          '接口地址: ',
          '【 ' + config.baseURL + url + ' 】'
        );
        console.error('请求参数: ', params);
        console.error('返回结果: ', res);
        
        reject(res);
      }
    });
  });
  return promise;
};

// 封装get请求（url:请求接口； data：请求参数；）
const httpGet = (url, data) => {
    let token = wx.getStorageSync('token');
  var header = {
    'token':token
  };
  var params = data && JSON.stringify(data) != '{}'
      ? '?' + requestParam(data, 'get')
      : '';
  var promise = new Promise((resolve, reject) => {
    // 网络请求
    wx.request({
      url: config.baseURL + url + params,
      header: header,
      method: 'GET',
      data: {},
      success: function(res) {
        // 服务器返回数据
        
        if (res.statusCode == 200) {
          resolve(res.data);
        }else if(res.statusCode == 401){
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          wx.showToast({
            title: '登录信息失效请重新授权登录',
            icon:'none'
          })
        }else {
          reject(res);
        }
      },
      fail: function(res) {
        console.log('============post 请求失败：============');
        console.error(
          '接口地址: ',
          '【 ' + config.baseURL + url + ' 】'
        );
        console.error('请求参数: ', params);
        console.error('返回结果: ', res);

        
        reject(res);
      }
    });
  });
  return promise;
};


module.exports = {
  Post: httpPost,
  Put: httpPut,
  Get: httpGet,
  Del: httpDel
};
