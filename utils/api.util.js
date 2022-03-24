/**
 * 本文件存方api定义
 */
const ENV_TYPE = require('./env');

const ENV_CONFIG = {
  UAT: {
    appid: "",
    baseURL: "", // 后台接口地址
  },
  PROD: {
    appid: "",
    baseURL: "", // 后台接口地址
  }
};
var config = {
  // 登录
  login: "/api/user/login", //登录接口
};
module.exports = config;