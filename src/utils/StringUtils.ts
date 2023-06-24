export default class StringUtils {
  static contains(obj, strs) {
    if (!strs) {
      return false;
    }
    let index = strs.length;
    while (index--) {
      if (strs[index] === obj) {
        return true;
      }
    }
    return false;
  }
  // 生成随机字符串
  static generateId(length) {
    return Number(
      Math.random().toString().substr(3, length) + Date.now(),
    ).toString(36);
  }
}
