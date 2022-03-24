// components/picker/picker.js
Component({
  properties:{
    list:Array
  },
  /**
   * 页面的初始数据
   */
  data: {
  },
  created(){
  },
  methods:{
    // 跳转到文章详情
    toActDetail(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/article/detail/detail?id='+id,
      });
        
    }

  }
  
})