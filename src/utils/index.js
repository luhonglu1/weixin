import df from "../wxcomponents/date-formate.js";
import ivewBase from "../wxcomponents/iview/base/index";
import QQMapWX from "../wxcomponents/qqmap-wx-jssdk.min";
import { MAP_KEY } from "@/utils/consts";
import { getStartEnd } from "@/filters";

export const qqmapsdk = new QQMapWX({ key: MAP_KEY });
// 时间格式化
export const safeDateFormat = value => {
  if ((value + "").indexOf("-") !== -1) {
    value = value.split("-").join("/");
  }
  return value;
};
export const dateformat = (value, formatStr = "yyyy-MM-dd hh:mm") => {
  value = safeDateFormat(value);

  return df.format(new Date(value), formatStr);
};

export const debounce = (fn, delay) => {
  var timer;
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function() {
    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this;
    var args = arguments;
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer);
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
};

export const isMobile = val => {
  if (val.length !== 11) return false;
  return /\d{11}/.test(val);
};

// 路由跳转
export const goto = (path, replace = false) => {
  console.log(path, "path");
  if (replace) {
    wx.redirectTo({ url: path });
  } else {
    wx.navigateTo({ url: path });
  }
};

export const goback = (obj = { delta: 1 }) => {
  console.log(obj);

  wx.navigateBack(obj);
};

//富文本数据格式化
export const escape2Html = str => {
  let arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
  return str
    .replace(/&(lt|gt|nbsp|amp|quot);/gi, t => arrEntities[t])
    .replace(/\<img/gi, '<img style="width:100%;height:auto"');
};

const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

export const guid = () => {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

export const toChinesNum = num => {
  let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]; //changeNum[0] = "零"
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = temp => {
    let strArr = temp
      .toString()
      .split("")
      .reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ""
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ""
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
        newNum;
    }
    return newNum;
  };
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = "0" + noWan;
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
};

export const validateItem = (value, errText, type = "empty", verification) => {
  if (type == "empty") {
    if (value === "") {
      ivewBase.$Toast({
        content: errText,
        type: "warning"
      });
      return false;
    } else {
      return true;
    }
  } else if (type == "custom") {
    let isOk = verification(value);
    if (!isOk) {
      ivewBase.$Toast({
        content: errText,
        type: "warning"
      });
    }
    return isOk;
  }
};

export const objToUrl = obj => {
  let arr = [];
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
    }
  }
  return arr.join("&");
};

//不丢失精度乘法
export const accMul = (arg1 = 0, arg2 = 0) => {
  let m = 0;
  let s1 = arg1.toString();
  let s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
};

//不丢失精度加法
export const addNum = (num1, num2) => {
  let sq1 = 0;
  let sq2 = 0;
  let m = 0;
  try {
    sq1 = num1.toString().split(".")[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = num2.toString().split(".")[1].length;
  } catch (e) {
    sq2 = 0;
  }
  m = Math.pow(10, Math.max(sq1, sq2));
  return (num1 * m + num2 * m) / m;
};

export const accSub = (num1, num2) => {
  let r1 = 0;
  let r2 = 0;
  let m = 0;
  let n = 0;
  try {
    r1 = num1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = r1 >= r2 ? r1 : r2;
  return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
};

export const getFileContext = fileKey => {
  let url = apiUtil.getConfigUrl("/ocr/queryFiles", "tools");
  return fly.get(url, { filekey: fileKey });
};

// 获取本周时间区间
export const getWeekTimeInterval = () => {
  //按周日为一周的最后一天计算
  let date = new Date(dateformat(Date.now(), "yyyy/MM/dd") + " 00:00:00");
  //今天是这周的第几天
  let today = date.getDay();
  //上周日距离今天的天数（负数表示）
  let stepSunDay = -today + 1;
  // 如果今天是周日
  if (today == 0) {
    stepSunDay = -7;
  }
  // 周一距离今天的天数（负数表示）
  let stepMonday = 7 - today;
  let time = date.getTime();
  let monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
  let sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
  return [monday, sunday];
};

// 获取本月时间区间
export const getMounthTimeInterval = () => {
  let start = new Date(dateformat(Date.now(), "yyyy/MM/dd") + " 00:00:00");
  start.setDate(1);
  // 获取当前月的最后一天
  var date = new Date(dateformat(Date.now(), "yyyy/MM/dd") + " 00:00:00");
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var end = new Date(nextMonthFirstDay - oneDay);
  return [start, end];
};

// 获取前三个月时间区间
export const getLast3MounthTimeInterval = () => {
  let now = new Date(dateformat(Date.now(), "yyyy/MM/dd") + " 00:00:00");
  let year = now.getFullYear();
  let month = now.getMonth() + 1; //0-11表示1-12月

  // 前两月的第一天
  let startMonth = month > 2 ? month - 2 : 12 + (month - 2);
  startMonth = startMonth > 9 ? startMonth : `0${startMonth}`;
  let startYear = month > 2 ? year : year - 1;
  let startDay = `${startYear}/${startMonth}/01 00:00:00`;

  // 本月最后一天
  let nextMonth = month < 12 ? month + 1 : 1;
  nextMonth = nextMonth > 9 ? nextMonth : `0${nextMonth}`;
  let nextYear = month < 12 ? year : year + 1;
  let nextMonthFirstDay = new Date(`${nextYear}/${nextMonth}/01 00:00:00`);
  let lastDay = nextMonthFirstDay.getTime() - 24 * 3600 * 1000;
  return [new Date(startDay), new Date(lastDay)];
};

// 授权拒绝后，再次授权提示弹窗
function authConfirm(that, tips, authStr, callback, errorBack, params = []) {
  wx.showModal({
    content: tips,
    confirmText: "确认",
    cancelText: "取消",
    success: function(res) {
      if (res.confirm) {
        wx.openSetting({
          success(res) {
            if (res.authSetting[authStr]) {
              callback(that, ...params);
            } else {
              wx.showToast({
                title: "您没有授权，请刷新重试",
                icon: "none",
                duration: 3000
              });
              if (errorBack) {
                errorBack(that);
              }
            }
          }
        });
      } else {
        wx.showToast({
          title: "您没有授权，请刷新重试",
          icon: "none",
          duration: 3000
        });
        if (errorBack) {
          errorBack(that);
        }
      }
    }
  });
}

// 授权
export const getWxAuth = (
  that,
  authEnum,
  tips,
  callback,
  errorBack,
  params = []
) => {
  // 传入全局变量  对应权限  打开授权设置页面的提示文本  成功的回调函数 失败回调 成功回调的参数列表
  let authStr = `scope.${authEnum}`;
  wx.getSetting({
    success(res) {
      if (res.authSetting[authStr]) {
        callback(that, ...params);
      } else if (res.authSetting[authStr] === undefined) {
        wx.authorize({
          scope: authStr,
          success() {
            callback(that, ...params);
          },
          fail() {
            authConfirm(that, tips, authStr, callback, errorBack, params);
          }
        });
      } else {
        authConfirm(that, tips, authStr, callback, errorBack, params);
      }
    }
  });
};
// 获取周列表 rangeBef为当前周的前几周 rangeLat为当前周的后几周
export const getDateWeekList = (tasteDate, rangeBef, rangeLat) => {
  const dayTime = 24 * 60 * 60 * 1000;
  let thisWeekStart = new Date(getStartEnd("week", tasteDate)[0]);
  let thisWeekEnd = +thisWeekStart + 6 * dayTime;
  let returnArr = [
    {
      desc: `${getStartEnd("week", tasteDate)[0]}~${
        getStartEnd("week", tasteDate)[1]
      }`,
      value: getStartEnd("week", tasteDate)
    }
  ];
  for (let i = 1; i <= rangeBef; i++) {
    let startTempBef = dateformat(
      +thisWeekStart - 7 * i * dayTime,
      "yyyy-MM-dd"
    );

    let endTempBef = dateformat(+thisWeekEnd - 7 * i * dayTime, "yyyy-MM-dd");
    returnArr.unshift({
      desc: `${startTempBef}~${endTempBef}`,
      value: [startTempBef, endTempBef]
    });
  }
  for (let i = 1; i <= rangeLat; i++) {
    let startTempLat = dateformat(
      +thisWeekStart + 7 * i * dayTime,
      "yyyy-MM-dd"
    );
    let endTempLat = dateformat(+thisWeekEnd + 7 * i * dayTime, "yyyy-MM-dd");
    returnArr.push({
      desc: `${startTempLat}~${endTempLat}`,
      value: [startTempLat, endTempLat]
    });
  }

  return returnArr;
};

// 保证时间格式
export const safeDate = val => {
  if ((val + "").indexOf("-") !== -1) {
    val = val.split("-").join("/");
  }
  return val;
};

const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = "tmp_base64src"; //自定义文件名

export const base64src = (base64data, cb) => {
  const [, format, bodyData] =
    /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  if (!format) {
    return new Error("ERROR_BASE64SRC_PARSE");
  }
  let timestamp = new Date().getTime();
  const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}${timestamp}.png`;
  const buffer = wx.base64ToArrayBuffer(bodyData);
  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: "binary",
    success(res) {
      cb(filePath);
    },
    fail() {
      return new Error("ERROR_BASE64SRC_WRITE");
    }
  });
};
