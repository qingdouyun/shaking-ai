import { history } from "@umijs/max";
import JumpType from '@/constants/JumpType';
import Cookies from 'js-cookie';
import StringUtils from './StringUtils';

export default class BaseUtils {
  static contains(obj: any, strs: any) {
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

  static isEmpty(parm: any) {
    return (
      parm === undefined ||
      parm === null ||
      parm === '' ||
      (typeof parm === 'object' && Object.keys(parm).length === 0) ||
      (typeof parm === 'string' && parm.trim().length === 0)
    );
  }

  static isJSON(str) {
    if (typeof str === 'string') {
        try {
            let obj=JSON.parse(str);
            if(typeof obj === 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
  }

  /** 是否微信浏览器 */
  static isWeiXin = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    return !!ua.match(/MicroMessenger/i)
  }

  static isEmail(email) {
    if (this.isEmpty(email)) {
      return false;
    }
    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    //调用正则验证test()函数
    return reg.test(email);
  }

  //插入html片段
  static insertHtml(where: any, el: any, html: any) {
    // eslint-disable-next-line no-param-reassign
    where = where.toLowerCase();
    if (el.insertAdjacentHTML) {
      switch (where) {
        case 'beforebegin':
          el.insertAdjacentHTML('BeforeBegin', html);
          return el.previousSibling;
        case 'afterbegin':
          el.insertAdjacentHTML('AfterBegin', html);
          return el.firstChild;
        case 'beforeend':
          el.insertAdjacentHTML('BeforeEnd', html);
          return el.lastChild;
        case 'afterend':
          el.insertAdjacentHTML('AfterEnd', html);
          return el.nextSibling;
      }
      throw 'Illegal insertion point -> "' + where + '"';
    }
    let range = el.ownerDocument.createRange();
    let frag;
    switch (where) {
      case 'beforebegin':
        range.setStartBefore(el);
        frag = range.createContextualFragment(html);
        el.parentNode.insertBefore(frag, el);
        return el.previousSibling;
      case 'afterbegin':
        if (el.firstChild) {
          range.setStartBefore(el.firstChild);
          frag = range.createContextualFragment(html);
          el.insertBefore(frag, el.firstChild);
          return el.firstChild;
        } else {
          el.innerHTML = html;
          return el.firstChild;
        }
      case 'beforeend':
        if (el.lastChild) {
          range.setStartAfter(el.lastChild);
          frag = range.createContextualFragment(html);
          el.appendChild(frag);
          return el.lastChild;
        } else {
          el.innerHTML = html;
          return el.lastChild;
        }
      case 'afterend':
        range.setStartAfter(el);
        frag = range.createContextualFragment(html);
        el.parentNode.insertBefore(frag, el.nextSibling);
        return el.nextSibling;
    }
    throw 'Illegal insertion point -> "' + where + '"';
  }

  //判断是否登录
  static isLogin = () => {
    const token = Cookies.get('token');
    if (BaseUtils.isEmpty(token)) {
      history.push('/login');
      return false;
    }
    return true;
  }

  static pageJump = (param: any) => {
    const token = Cookies.get('token');
    if (param.pageCode === JumpType.AccountSetting) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/account/setting');
    } else if (param.pageCode === JumpType.MyReceivers) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/receiver/list');
    } else if (param.pageCode === JumpType.AuthPersonal) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/auth/personal');
    } else if (param.pageCode === JumpType.AuthResult) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/auth/result');
    } else if (param.pageCode === JumpType.MyCards) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/card/list');
    } else if (param.pageCode === JumpType.NoticeDetail) {
      history.push('/notice/detail/' + param.pageParam.key,{'window':{'title':'公告'}});
    } else if (param.pageCode === JumpType.ArticleDetail) {
      history.push('/article/detail/' + param.pageParam.key,{'window':{'title':'图文'}});
    } else if (param.pageCode === JumpType.GoodsDetail) {
      history.push('/goods/detail/' + param.pageParam.key,{'window':{'title':'商品'}});
    } else if (param.pageCode === JumpType.CardDetail) {
      history.push('/card/detail/' + param.pageParam.key,{'window':{'title':'权益卡'}});
    } else if (param.pageCode === JumpType.NoticeList) {
      history.push('/notice/list',{'window':{'title':'公告'}});
    } else if (param.pageCode === JumpType.MyOrders) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/order/list');
    } else if (param.pageCode === JumpType.AiChat) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/ai/chat');
    } else if (param.pageCode === JumpType.Share) {
      if (BaseUtils.isEmpty(token)) {
        history.push('/login',{'window':{'title':'登录'}});
        return;
      }
      history.push('/user/share');
    } else if (param.pageCode === JumpType.AiProductDetail) {
      history.push('/ai/product/detail/' + param.pageParam.key,{'window':{'title':'AI产品'}});
    } else if (param.pageCode === JumpType.TabBar) {
      history.push(param.pagePath);
    } else if (param.pageCode === JumpType.CustomPage) {
      const pageUrl = param.pagePath.replace('/pages', '');
      history.push(pageUrl + '?key=' + param.pageParam.key);
    } else if (param.pageCode === JumpType.CustomLink) {
      window.location.href = param.pagePath;
    }
  };

}
