/**
 * 基础组件 附带一个全局拖拽按钮
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hiddens: {
      type: Boolean,
      value: false,
      observer: function (n, o) {
        console.log(n, 'base最终结果')
      }
    },
    inspetion: {
      type: Boolean,
      value: false,
      observer: function (n, o) {
        this.setData({
          hidely: n
        })
      }
    },
    showPhoneIcon: {
      type: Boolean,
      value: true,
      observer: function (n, o) {
        this.setData({
          showPhoneIcon: n
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    isMove: false,
    show: false,
    animateEnd: false,
    otherPage: false,
  },
  lifetimes: {
    attached: function () {
      // 获取不到movable-view的宽度 只能固定64像素，取一半
      const lastX = wx.getStorageSync('baseLastX');
      const lastY = wx.getStorageSync('baseLastY');
      this.setData({
        x: lastX || wx.getSystemInfoSync().windowWidth,
        y: lastY || wx.getSystemInfoSync().windowHeight / 2 - 64,
        lastX: lastX || wx.getSystemInfoSync().windowWidth,
        lastY: lastY || wx.getSystemInfoSync().windowHeight / 2 - 64,
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchEnd(event) {
      const {
        clientX,
        clientY
      } = event.changedTouches[0];
      // 无移动，判定为点击
      if (!this.data.isMove) {
        const token = wx.getStorageSync('token');
        if (!token) {
          wx.showToast({
            title: '请先登录哦！',
            icon: 'none'
          });
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/mine/mine',
            });
          }, 1500);
          return;
        }
        // this.setData({
        //   show: true,
        //   x: wx.getSystemInfoSync().windowWidth / 2 - 64,
        //   y: wx.getSystemInfoSync().windowHeight / 2 - 64,
        // });
        wx.navigateTo({
          url: '/pages/packageB/voice/voice',
        })
        return;
      }
      this.setData({
        isMove: false
      });
      const position = {
        x: 0,
        y: clientY - 64
      };
      position.x =
        wx.getSystemInfoSync().windowWidth / 2 - 64 < clientX ?
        wx.getSystemInfoSync().windowHeight :
        0;
      wx.setStorageSync('baseLastX', position.x);
      wx.setStorageSync('baseLastY', position.y);
      this.setData(position);
    },
    handleTouchMove() {
      if (this.data.isMove) return;
      this.setData({
        isMove: true,
      });
    },
    handleTouchStart(event) {
      // 记录上次点击位置，方便还原
      const {
        clientX,
        clientY
      } = event.changedTouches[0];
      this.setData({
        lastX: clientX - 32,
        lastY: clientY - 32,
      });
    },
    animationEnd() {
      this.setData({
        animateEnd: true,
      });
    },
    handleClose() {
      if (this.data.otherPage) {
        this.setData({
          otherPage: false
        })
        return;
      }
      this.setData({
        animateEnd: false,
        show: false,
        x: this.data.lastX,
        y: this.data.lastY,
      });
    },
  }
});