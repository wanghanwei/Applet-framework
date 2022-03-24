// 清理请求参数

const moment = require('../utils/moment.min')

const cleanParams = function(params = {}) {
  const obj = {};
  Object.keys(params).forEach(d => {
    if (params[d] || params[d] === 0) {
      obj[d] = params[d];
    }
  });
  return obj;
};
function formatDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d;
   
};

function computeCardEnd(cardNumber, start) {
  const cardInfo = parseIdCardInfo(cardNumber);
  if (!cardInfo.isTrue || !start) {
    return;
  }
  const birthDay = cardInfo.year + '-' + cardInfo.month + '-' + cardInfo.day;
  const cardAge = moment(start).diff(moment(birthDay), 'y');
  let endDate;
  let type = 1; // 短期
  if (cardAge < 0) {
    return;
  }
  if (cardAge >= 46) {
    type = 2; // 长期
    return { type };
  }
  if (cardAge >= 0 && cardAge < 16) {
    endDate = moment(start).add(5, 'y');
  } else if (cardAge >= 16 && cardAge < 26) {
    endDate = moment(start).add(10, 'y');
  } else if (cardAge >= 26 && cardAge < 46) {
    endDate = moment(start).add(20, 'y');
  }
  endDate = endDate ? endDate.format('YYYY-MM-DD') : '';
  return  { endDate,type } ;
}

function parseIdCardInfo(cardNo) {
  var info = {
    isTrue: false, // 身份证号是否有效。默认为 false
    year: null, // 出生年。默认为null
    month: null, // 出生月。默认为null
    day: null, // 出生日。默认为null
    isMale: false, // 是否为男性。默认false
    isFemale: false, // 是否为女性。默认false
    provice: null, //省代码
    city: null, //城市代码
    county: null, //区代码
  };

  if (
    typeof cardNo !== 'string' ||
    (cardNo.length !== 15 && cardNo.length !== 18)
  ) {
    info.isTrue = false;
    return info;
  }

  if (cardNo.length === 15) {
    const year = cardNo.substring(6, 8);
    const month = cardNo.substring(8, 10);
    const day = cardNo.substring(10, 12);
    const p = cardNo.substring(14, 15); // 性别位
    const birthday = new Date(
      parseFloat(year),
      parseFloat(month) - 1,
      parseFloat(day)
    );
    if (
      birthday.getFullYear() !== parseFloat(year) ||
      birthday.getMonth() !== parseFloat(month) - 1 ||
      birthday.getDate() !== parseFloat(day)
    ) {
      info.isTrue = false;
    } else {
      info.isTrue = true;
      info.year = birthday.getFullYear();
      info.month = birthday.getMonth() + 1;
      info.day = birthday.getDate();
      if (parseFloat(p) % 2 === 0) {
        info.isFemale = true;
        info.isMale = false;
      } else {
        info.isFemale = false;
        info.isMale = true;
      }
    }
    return info;
  }

  if (cardNo.length === 18) {
    const year = cardNo.substring(6, 10);
    const month = cardNo.substring(10, 12);
    const day = cardNo.substring(12, 14);
    const p = cardNo.substring(14, 17);
    const birthday = new Date(
      parseFloat(year),
      parseFloat(month) - 1,
      parseFloat(day)
    );
    const pr = cardNo.substring(0, 2) + '0000';
    const c = cardNo.substring(0, 4) + '00';
    const co = cardNo.substring(0, 6);
    if (
      birthday.getFullYear() !== parseFloat(year) ||
      birthday.getMonth() !== parseFloat(month) - 1 ||
      birthday.getDate() !== parseFloat(day)
    ) {
      info.isTrue = false;
      return info;
    }

    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    const Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X

    // 验证校验位
    let sum = 0; // 声明加权求和变量
    let _cardNo = cardNo.split('');
    if (typeof _cardNo[17] === 'string' && _cardNo[17].toLowerCase() === 'x') {
      _cardNo[17] = '10'; // 将最后位为x的验证码替换为10方便后续操作
    }
    for (let i = 0; i < 17; i++) {
      const j = parseInt(_cardNo[i], 10);
      sum += Wi[i] * j; // 加权求和
    }
    const j = sum % 11; // 得到验证码所位置

    if (Number(_cardNo[17]) !== Y[j]) {
      info.isTrue = false;
      return info;
    }

    info.isTrue = true;
    info.year = birthday.getFullYear();
    info.month = birthday.getMonth() + 1;
    info.day = birthday.getDate();

    info.month = info.month < 10 ? '0' + info.month : info.month;
    info.day = info.day < 10 ? '0' + info.day : info.day;

    if (parseInt(p, 10) % 2 === 0) {
      info.isFemale = true;
      info.isMale = false;
    } else {
      info.isFemale = false;
      info.isMale = true;
    }

    info.provice = pr;
    info.city = c;
    info.county = co;

    return info;
  }
  return info;
}

function  GetDays(day) {
  var time = new Date();
  time.setDate(time.getDate() - day);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return y + "-" + m + '-' + d;
}
// 存储本地
 function getStorage(key) {
  let val;
  try {
    val = JSON.parse(wx.getStorageSync(key));
  } catch (e) {
    val = wx.getStorageSync(key)
  }
  return val;
}

function setStorage(key, value) {
  wx.setStorageSync(
    key,
    typeof value === 'object' ? JSON.stringify(value) : value
  );
}

function clearStorage(key) {
  wx.removeStorageSync(key);
}
function queryString(query) {
  return Object.keys(query).reduce((prve, next) => {
    const str = prve ? '&' : '?';
    prve += `${str}${next}=${encodeURIComponent(query[next])}`;
    return prve;
  }, '')
}
module.exports = {
  cleanParams,
  formatDate,
  computeCardEnd,
  parseIdCardInfo,
  GetDays,
  getStorage,
  setStorage,
  clearStorage,
  queryString
};
