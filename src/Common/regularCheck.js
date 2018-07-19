// 此文件用于格式校验

/*  正则校验构造函数
* @param reg使用的正则表达式
* @return 正则检验函数，参数str为要校验的字符串
* */
function RegCheck(reg) {
    return function (str) { //闭包函数
        return reg.test(str);
    };
}


/*  手机号校验
*   @param str输入的字符串
*   @return 校验是否正确的布尔值
* */
export let phoneRegCheck = RegCheck(/^1[3|5|7|8]\d{9}$/);

