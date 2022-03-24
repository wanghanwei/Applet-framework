// components/picker/picker.js
Component({
  properties:{
    show:Boolean,
    title:String,
    content:String,
    cancelTxt:String,
    comfirmTxt:String
  },
  /**
   * 页面的初始数据
   */
  data: {
    selectPicker:null
  },
  methods:{
    cancel(){
      this.triggerEvent('showComfirm')
    },
    // 确定按钮
    saveData(){
      this.triggerEvent('comfirmBtn')
    }
  }
  
})