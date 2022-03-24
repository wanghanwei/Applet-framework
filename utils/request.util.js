const T = require("util");
const utils = require("../utils/common.util");
if (utils.compareVersion()) {
  const regeneratorRuntime = require("regenerator-runtime");
} else {
  throw Error("基础库版本过低");
}

/**
 * 公用请求函数
 * @param {object} options 请求选项
 * @param {object} options.data 请求数据
 * @param {boolean} options.showLoading 是否显示Loading
 * @param {function} options.success 请求成功回调
 * @param {function} options.fail 请求失败回调
 * @param {function} options.complete 请求完成回调
 * @param {string} url 请求url
 * @returns {undefined} undefined
 */
const request = (url, options) =>
  new Promise((resolve, reject) => {
    options.data = options.data || {};
    // options.data.sid = getApp().sid;
    if (opts.showLoading) {
      T.showLoading();
    }
    wx.request({
      url: url,
      method: opts.method || "GET",
      data: opts.data || {},
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      success: function (res) {
        let result = res.data;
        if (result.code == 10001) {
          getApp().clearSid();
        }
        if (result.code == 58999) {
          //(result.code == 58999){ // sid过期58999
          getApp().refreshSid(function () {
            console.log("sid已过期，即将刷新sid，并重复当前接口");
            // TODO
            // sessionRequest(opts, url, hideToast);
          });
          return;
        }
        if (!result.success && result.msg && !hideToast) {
          wx.showToast({
            title: result.msg,
            icon: "none",
            duration: 2000,
          });
        }
        resolve(result);
      },
      fail: function (res) {
        reject(res);
      },
      complete: function (res) {
        if (opts.showLoading) {
          T.hideLoading();
        }
      },
    });
  });

module.exports = {
  request: request,
};
