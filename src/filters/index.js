import isInteger from "lodash/isInteger";

export const AppEnums = {};

export const emptyHlod = (value, payload = "--") => {
  if (value != null) {
    return value;
  } else {
    return payload;
  }
};

export const Enumstr = (
  value,
  enumKey = "",
  option = { desc: true, popKey: "code" }
) => {
  let enums = AppEnums[enumKey] || [];
  let item = enums.find((item) => item[option.popKey || "code"] == value);
  //desc为true  返回desc文描 否则 返回对象
  return option.desc ? (item ? item.desc : "") : item;
};
export const Enumstr2 = (
  value,
  enumList = [],
  option = { desc: true, popKey: "code" }
) => {
  let enums = enumList || [];
  let item = enums.find((item) => item[option.popKey || "code"] == value);
  //desc为true  返回desc文描 否则 返回对象
  return option.desc ? (item ? item.desc : "") : item;
};

export const EnumList = (
  list,
  enumKey = "",
  option = { desc: true, popKey: "code" },
  linkStr = "、"
) => {
  let arr = [];

  list &&
    list.forEach((v) => {
      arr.push(Enumstr(v, enumKey, option));
    });
  return arr.join(linkStr);
};
// 传入list过滤
export const EnumList2 = (
  list,
  enumList = [],
  option = { desc: true, popKey: "code" },
  linkStr = "、"
) => {
  let arr = [];

  list &&
    list.forEach((v) => {
      arr.push(Enumstr2(v, enumList, option));
    });
  return arr.join(linkStr);
};

export const toFix2 = (value, fixNum = 2) => {
  let val = value || 0;
  return isInteger(val) ? val : val.toFixed(fixNum);
};

//不丢失精度 取余
function accMod(arg1, arg2) {
  // 修正取余精度
  const ACCURACY_CORRECT = 10000000000;
  return (
    ((arg1 * ACCURACY_CORRECT) % (arg2 * ACCURACY_CORRECT)) / ACCURACY_CORRECT
  );
}

/**
 * 处理小数 如果是整数,取整,如果是小数,保留两位
 * 233->233
 * 233.12222->233.12
 * */
function cutNum(v, dg = 2) {
  if (!v) return 0;
  return String(+v).includes(".") ? Number(v.toFixed(dg)) : v;
}

// 获取第一天（本月or本周or昨天）type: month | week | day
export const getStartEnd = (type, chooseDate) => {
  let defaultDay = chooseDate ? new Date(chooseDate) : new Date();
  let year = defaultDay.getFullYear();
  let month = defaultDay.getMonth() + 1;
  let day = defaultDay.getDate();
  let str = year + "/" + month + "/" + day;
  let now = new Date(str);
  let startStr;
  let endStr;

  if (type === "month") {
    let monStr = month < 10 ? "0" + month : month;
    let dayStr = day < 10 ? "0" + day : day;

    startStr = year + "-" + monStr + "-01";
    endStr = year + "-" + monStr + "-" + dayStr;
    return [startStr, endStr];
  }

  if (type === "week") {
    let monStr = month < 10 ? "0" + month : month;
    let dayStr = day < 10 ? "0" + day : day;
    let temp = defaultDay.getDay() === 0 ? 6 : defaultDay.getDay() - 1;

    let star = new Date(defaultDay - temp * 86400000);

    let year1 = star.getFullYear();

    let month1 = star.getMonth() + 1;
    let day1 = star.getDate();

    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;

    startStr = year1 + "-" + month1 + "-" + day1;

    endStr = year + "-" + monStr + "-" + dayStr;
    return [startStr, endStr];
  }
  if (type === "day") {
    let monStr = month < 10 ? "0" + month : month;
    let dayStr = day < 10 ? "0" + day : day;
    endStr = year + "-" + monStr + "-" + dayStr;
    startStr = year + "-" + monStr + "-" + dayStr;
    return [startStr, endStr];
  }

  return [];
};

export const to10000 = (val) => {
  return val ? +(val / 10000).toFixed(2) + "万" : "0万";
};

export const convertCurrency = (money) => {
  //汉字的数字
  let cnNums = new Array(
    "零",
    "壹",
    "贰",
    "叁",
    "肆",
    "伍",
    "陆",
    "柒",
    "捌",
    "玖"
  );
  //基本单位
  let cnIntRadice = new Array("", "拾", "佰", "仟");
  //对应整数部分扩展单位
  let cnIntUnits = new Array("", "万", "亿", "兆");
  //对应小数部分单位
  let cnDecUnits = new Array("角", "分", "毫", "厘");
  //整数金额时后面跟的字符
  let cnInteger = "整";
  //整型完以后的单位
  let cnIntLast = "元";
  //最大处理的数字
  let maxNum = 999999999999999.9999;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = "";
  //分离金额后用的数组，预定义
  let parts;
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return "";
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != "") {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    chineseStr += cnInteger;
  }
  return chineseStr;
};

// 千分位转换
export const formatNum = (num) => {
  if (!num) return "0";
  return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
};
// 字符串保留2位小数
export const numStrFix2 = (num, dig = 2) => {
  let str1 = num.split(".")[0];
  let str2 = num.split(".")[1];
  if (!str2) return str1;
  let point = str2.substring(0, dig);
  return str1 + "." + point;
};
// 百分比转换
export const rateFormat = (num) => {
  if (!num) return "0%";
  return Math.round(num * 10000) / 100 + "%";
};

//处理千分符
// val待处理数据 digits保留几位小数
export const moneyFixed = (val, digits = 0) => {
  let num = 0;
  if (digits === 0) {
    num = val ? Math.round(val) : 0;
  } else {
    num = val ? +val.toFixed(digits) : 0;
  }

  let returnArr = (num + "").split(".");
  let temp0 = returnArr[0];
  // let count = Math.floor(temp0.length / 3)
  let firstNum = (temp0 + "").length % 3;
  // console.log(firstNum, "firstNumfirstNum");

  let tempArr = [];
  for (let i = 0; i < temp0.length; i++) {
    if (i === firstNum - 1 || (i + 1) % 3 === firstNum) {
      tempArr.push(temp0[i]);

      tempArr.push(",");
    } else {
      tempArr.push(temp0[i]);
    }
  }

  if (tempArr[tempArr.length - 1] == ",") {
    tempArr.pop();
  }

  returnArr[0] = tempArr.join("");
  return returnArr.join(".");
};

// 距离米转千米
export const transRice = (num)=>{
  let rice = num - 0
  if(isNaN(rice)) return '0km'
  if(rice < 100) return '0km'
  return (rice / 1000 ).toFixed(1) + 'km'
}
