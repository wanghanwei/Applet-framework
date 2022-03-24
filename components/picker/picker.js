// components/picker/picker.js
const util = require('../../utils/util');
Component({
  properties:{
    show:Boolean,
    list:Array,
    title:String,
    type:String,
    areaList:Object,
    currentVal:{
      type:Number,
      value:new Date().getTime()
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    selectPicker: null,
    maxDate: new Date().getTime(),
    minDate: new Date(util.GetDays(30000)).getTime(),
    endDate: new Date('2999-12-31').getTime(),
    defaultArea: ['110000', '110101', '']
  },
  created(){
    console.log(util.GetDays(30000))
  },
  methods:{
    showPicker(){
      this.triggerEvent('showPicker')
    },
    // 切换省市区
    changeArea(e){

      const select = e.detail.value.map((item, index) => ({
        code: item || '',
        name: e.detail.displayValue[index] || ''
      }))
      console.log(select);
      this.setData({
        selectPicker: select
      })
    },
    onInput(event) {
      let value=event.detail.getColumnValue(0)+'-'+event.detail.getColumnValue(1)+'-'+event.detail.getColumnValue(2)//获取到时间
      this.setData({
        currentVal: new Date(value).getTime()
      });
    },
    saveDate(e){
      wx.showLoading({
        title: ''
      });
      setTimeout(()=>{
        this.triggerEvent('confirmPicker',util.formatDate(this.data.currentVal))
        wx.hideLoading();
      },1500)
    },
    // 省市区确定
    saveAreaData(){
      let select = this.data.selectPicker;
      if(!select || !select[1] || select[1].code == ''){
        // wx.showToast({
        //   title: '请选择完整的省市区',
        //   icon:'none'
        // })
        // return
        select = [{code: "110000", name: "北京市"}, {code: "110101", name: "东城区"}, {code: "", name: ""}];
      }
      this.triggerEvent('confirmPicker',select)
    },
    // 切换关系选择
    changePicker(e){
      let value = e.detail.value
      // 暂存
      this.setData({
        selectPicker:value
      })
    },
    // 确定按钮
    saveData(){
      let select = this.data.selectPicker;
      if(!select){
        select = this.data.list[0]
      }
      this.triggerEvent('confirmPicker',select)
    }
  }
  
})