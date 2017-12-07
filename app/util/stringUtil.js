/**
 * Created by xiaobxia on 2017/11/1.
 */
function hyphenToCamelCase(str) {
  let strArr = str.split('_');
  strArr[0] = strArr[0].toLowerCase();
  for (let i = 1, len2 = strArr.length; i < len2; i++) {
    let strTemp = strArr[i].toLowerCase();
    strArr[i] = strTemp.charAt(0).toUpperCase() + strTemp.substring(1);
  }
  return strArr.join('');
}

function camelCaseToHyphen(str) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

module.exports = {
  /**
   * 连字符转驼峰
   */
  hyphenToCamelCase,
  keyToCamelCase(data) {
    let tempItem = {};
    for (let str in data) {
      if (data.hasOwnProperty(str)) {
        tempItem[hyphenToCamelCase(str)] = data[str];
      }
    }
    return tempItem;
  },
  listToCamelCase(data) {
    let tempData = [];
    for (let k = 0, len = data.length; k < len; k++) {
      let tempItem = {};
      for (let str in data[k]) {
        if (data[k].hasOwnProperty(str)) {
          tempItem[hyphenToCamelCase(str)] = data[k][str];
        }
      }
      tempData.push(tempItem);
    }
    return tempData;
  },
  /**
   * 驼峰转连字符
   */
  camelCaseToHyphen,
  keyToHyphen(data) {
    let tempItem = {};
    for (let str in data) {
      if (data.hasOwnProperty(str)) {
        tempItem[camelCaseToHyphen(str)] = data[str];
      }
    }
    return tempItem;
  },
  listToHyphen(data) {
    let tempItem = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        tempItem[camelCaseToHyphen(key)] = data[key];
      }
    }
    return tempItem;
  }
};
