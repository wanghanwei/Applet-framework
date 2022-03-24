const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

/**
 * 对比当前版本是否是我们需要兼容的版本
 */
const compareVersion = (n) => {
  const version = wx.getSystemInfoSync().SDKVersion;
  console.log("版本号", version);
  if (isLowVersion(version, "2.2.1") >= 0) {
    // wx.openBluetoothAdapter()
    return true;
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
    });
    return false;
  }
};

/**
 * 对比v1本版是否低于v2版本
 * @param {*} v1
 * @param {*} v2
 */
const isLowVersion = (v1, v2) => {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};

module.exports = {
  compareVersion: compareVersion,
  isLowVersion: isLowVersion,
  formatTime: formatTime,
};
