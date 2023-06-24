/* 
    公共函数
*/
const METHOD = {
    ADDPX: Symbol('addPx'),
    REMOVEARR:Symbol('removeArr')
}
export default class Common {
    addPx(str: any) {
        return this[METHOD.ADDPX](str)
    }
    removeArr(arr, el, num=1) {
        if(!(Array.isArray(arr))) return Error('你输入removeArr的第一个参数必须是数组')
        if(el===undefined || el===null || el==='') return Error('请输入你要删除的元素')
        return this[METHOD.REMOVEARR](arr, el, num)
    }

    [METHOD.ADDPX](str) {
        let mStr = str.split(','), arr = [];
        mStr.map(item=>arr.push(`${item}px`));
        return arr.join(' ');
    }
    // arr要删除的数组， num删除的个数
    [METHOD.REMOVEARR](arr, el, num) {
        return arr.splice(arr.indexOf(el),num)
    }
}