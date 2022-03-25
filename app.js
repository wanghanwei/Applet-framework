// 工具库
const http = require("./utils/request");
// 常量定义
const globalData = require("./utils/const");
App({
  globalData,
  http,
  onLaunch: function () {
    
    //获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.system = res;
      },
    });
    // 判断设备是否为全面屏
    this.checkFullSucreen();
    //获取胶囊信息
    this.menu = wx.getMenuButtonBoundingClientRect();
  },
  onShow: function (e) {
    var that = this
    // 监听内存不存情况
    wx.onMemoryWarning(function () {
      wx.showToast({
        title: '当前手机内存使用量过高，请关闭其他多余应用。',
        icon: 'none',
        duration: 3000,
      });
      return;
    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  checkFullSucreen: function () {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log("判断是否为全面屏", res); // 根据 屏幕高度 进行判断
        if (
          res.screenHeight - res.windowHeight - res.statusBarHeight - 32 >
          72
        ) {
          self.globalData.isFullSucreen = true;
        }
      },
    });
  },
  //提交内存溢出手机的类型
  getUserInfo () {
    const res = this.system
    let params = {
      benchmarklevel:res.benchmarklevel,
      brand:res.brand,
      model:res.model,
      phonePlatform:res.platform,
      phoneSystem:res.system,
      wechatVersion:res.version
    }
    http.Post(this.globalData.config.phoneInfo,params).then((data)=>{
    })
  },

  // 结束回溯录制
  endCallFun(url){
    let secretInsureNum = this.getUrlData('secretInsureNum',url);
    http.Post(this.globalData.config.endCall,{
      secretInsureNum
    }).then((data)=>{
    })
  },
  getUrlData(name, str) {
    const reg = new RegExp(`(^|&)${ name}=([^&]*)(&|$)`);
    const r = str.substr(1).match(reg);
    if (r != null) return  decodeURIComponent(r[2]); return null;
  }
});
