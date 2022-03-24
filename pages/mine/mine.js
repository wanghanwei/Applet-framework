// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    careMod: false, //关怀模式
    statusHeight: app.system.statusBarHeight,
    navHeight: (app.menu.top - app.system.statusBarHeight) * 2 + app.menu.height,
  },
  onLoad: function () {
    // let that = this
  },
})