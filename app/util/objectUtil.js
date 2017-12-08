/**
 * Created by xiaobxia on 2017/7/20.
 */
module.exports = {
  //把对象转换成一种格式
  model(base, target) {
    let temp = {};
    for (const key in base) {
      if (base.hasOwnProperty(key)) {
        //如果有这个key
        if (target[key]) {
          temp[key] = target[key];
        } else {
          //如果有默认值
          if (base[key]) {
            temp[key] = base[key];
          }
        }
      }
    }
    return temp;
  }
};
