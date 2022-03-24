// api定义
const config = require('./api.util');

const constant = {
  isFullSucreen: false,  // 当前设备是否为 FullSucreen
  userInfo: null,
  config,
  pageSize: 8, // 分页
  noDataText: '没有更多数据了',
  loadMoreText: '加载更多数据',
  regs: {
    moblie: { pattern: /^(?!19855572506)(13|14|15|17|18|16|19)\d{9}$|^950\d{9,15}$/, msg: '手机号码必须为11位数字,1开头, 格式参考130xxxx0000' },
    email: { pattern: /^[\w\u4e00-\u9fa5]+([-+.][\w\u4e00-\u9fa5]+)*@[\w\u4e00-\u9fa5]+([-.][\w\u4e00-\u9fa5]+)*\.[\w\u4e00-\u9fa5]+([-.][\w\u4e00-\u9fa5]+)*$/, msg: '电子邮箱格式不正确,格式参考: zhuyy@163.com' },
    idNumber: { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, msg: '不是有效的身份证号码' },
  },
};

module.exports = constant;
