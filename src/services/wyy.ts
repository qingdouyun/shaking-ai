import { history } from 'umi';
import { request } from '@umijs/max';
import Cookies from 'js-cookie';
import SHA1 from '../utils/SHA1';
import { message } from 'antd';
import configs from '@/constants/configs';


export default {
  async request(options: any) {
    const token = Cookies.get('token');

    // APP签名 --start--
    let date = new Date().getTime();
    let timestamp = Cookies.get('timestamp');
    let appToken = Cookies.get('appToken');
    Cookies.set('timestamp', date);
    let shakey = SHA1.sha1(configs.APPID + 'SKCLOUD' + configs.APPKEY + 'SKCLOUD' + date);
    appToken = shakey + '.' + date;
    Cookies.set('appToken', appToken);
    // if (!appToken) {
    //   Cookies.set('timestamp', date);
    //   let shakey = SHA1.sha1(APPID + 'SKCLOUD' + APPKEY + 'SKCLOUD' + date);
    //   appToken = shakey + '.' + date;
    //   Cookies.set('appToken', appToken);
    // }
    // if (timestamp) {
    //   if (date - timestamp > 2 * 3600 * 1000) {
    //     // 用户打开APP超过2小时，重新签名
    //     Cookies.set('timestamp', date);
    //     setTimeout(() => {
    //       let shakey = SHA1.sha1(APPID + 'SKCLOUD' + APPKEY + 'SKCLOUD' + date);
    //       Cookies.set('appToken', shakey + '.' + date);
    //     }, 100);
    //   }
    // }
    // APP签名 --end--

    const newOptions = {
      method: options.method,
      headers: {
        'X-App-ID': configs.APPID,
        'X-App-Token': appToken ? appToken : '',
        'X-Api-Version': 'v1',
        token: token ? token : '',
      },
      params: {},
      requestType: 'form',
      data: {},
      body: {}
    };

    if (options.method === 'GET') {
      newOptions.params = options.data;
    }
    if (
      options.method === 'POST' ||
      options.method === 'PUT' ||
      options.method === 'DELETE'
    ) {
      if (!(options.data instanceof FormData)) {
        if (options.type === 'json') {
          // 此种情况后台Java接口需要加 @RequestBody 注解
          newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            ...newOptions.headers,
          };
          newOptions.requestType = 'json';
        } else {
          newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            ...newOptions.headers,
          };
          newOptions.requestType = 'form';
        }
        newOptions.params = options.data;
      } else {
        // options.data is FormData
        newOptions.headers = {
          Accept: 'application/json',
          ...newOptions.headers,
        };
        newOptions.body = options.data;
      }
    }
    //axios请求
    const result = await request(options.url, newOptions);
    if (result) {
      if(result?.code === 'login_expired') {
        message.warn('登录超时，请重新登录！')
        setTimeout(() => {
          history.push({
            pathname: '/login',
          });
        }, 500);
      }
      if (result?.status === 401) {
        message.error('登录超时，请重新登录！');
        setTimeout(() => {
          history.push({
            pathname: '/login',
          });
        }, 500);
      } else if (result?.status === 406) {
        message.error('请求资源不可访问！');
      }
    }
    return result;
  },
};
