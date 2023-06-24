import wyy from './wyy';
import Cookies from 'js-cookie';
const appInfo = JSON.parse(localStorage.getItem("appInfo"));

// api 接口
export default {
  async init(params = {}) {
    return wyy.request({
      url: '/api/common/init',
      method: 'GET',
      data: params,
    });
  },
  //阿里云oss
  async getOssSign(params = {}) {
    return wyy.request({
      url: '/api/user/oss/get_signature',
      method: 'GET',
      data: params,
    });
  },
  //配送方式
  async getShippingMethods(params = {}) {
    return wyy.request({
      url: '/api/common/get_shipping_methods',
      method: 'GET',
      data: params,
    });
  },
  async uploadOss(params = {}) {
    const path = appInfo.ossDomain;
    return wyy.request({
      url: path,
      method: 'POST',
      data: params,
    });
  },
  //登陆
  async login(params = {}) {
    return wyy.request({
      url: '/api/user/login',
      method: 'POST',
      data: params,
    });
  },
  //验证码登陆
  async login_by_code(params = {}) {
    return wyy.request({
      url: '/api/user/login/by_code',
      method: 'POST',
      data: params,
    });
  },
  //注册
  async register(params = {}) {
    return wyy.request({
      url: '/api/user/register',
      method: 'POST',
      data: params,
    });
  },
  //忘记密码
  async forget(params = {}) {
    return wyy.request({
      url: '/api/user/findpass',
      method: 'POST',
      data: params,
    });
  },
  //意见反馈
  async feedback(params = {}) {
    return wyy.request({
      url: '/api/user/feedback',
      method: 'POST',
      data: params,
    });
  },
  //退出登录
  async logout(params = {}) {
    return wyy.request({
      url: '/api/user/logout',
      method: 'POST',
      data: params,
    });
  },
  app: {
    //应用信息
    async getInfo(params = {}) {
      return wyy.request({
        url: '/api/app/get_info',
        method: 'GET',
        data: params,
      });
    },
    //首页
    async getHome(params = {}) {
      return wyy.request({
        url: '/api/app/page/get_home',
        method: 'GET',
        data: params,
      });
    },
    //导航页
    async getTabBarPage(params = {}) {
      return wyy.request({
        url: '/api/app/page/get_tab_bar_page',
        method: 'GET',
        data: params,
      });
    },
    //微页面
    async getPage(params = {}) {
      return wyy.request({
        url: '/api/app/page/get_custom_page',
        method: 'GET',
        data: params,
      });
    },
    //用户中心
    async getUserCenterPage(params = {}) {
      return wyy.request({
        url: '/api/app/page/get_user_center',
        method: 'GET',
        data: params,
      });
    },
  },
  notice: {
    //获取公告列表
    async list(params = {}) {
      return wyy.request({
        url: '/api/common/notice/list',
        method: 'GET',
        data: params,
      });
    },
    async detail(params = {}) {
      return wyy.request({
        url: '/api/common/notice/detail',
        method: 'GET',
        data: params,
      });
    },
  },
  article: {
    //获取图文列表
    async list(params = {}) {
      return wyy.request({
        url: '/api/cms/article/list',
        method: 'GET',
        data: params,
      });
    },
    async detail(params = {}) {
      return wyy.request({
        url: '/api/cms/article/detail/' + params.key,
        method: 'GET',
        data: params,
      });
    },
  },
  msg: {
    //修改手机号的验证码校验
    async check_code(params = {}) {
      return wyy.request({
        url: '/api/common/msg/check_code/update_mobile',
        method: 'POST',
        data: params,
      });
    },
    //发送短信验证码
    async send_code(params = {}) {
      return wyy.request({
        url: '/api/common/msg/send_code/' + params.type,
        method: 'POST',
        data: params,
      });
    },
  },
  goods: {
    //商品列表
    async list(params = {}) {
      return wyy.request({
        url: '/api/goods/list',
        method: 'GET',
        data: params,
      });
    },
    //商品详情
    async detail(params = {}) {
      return wyy.request({
        url: '/api/goods/detail/' + params.key,
        method: 'GET',
        data: params,
      });
    },
    //商品评论
    async comments(params = {}) {
      return wyy.request({
        url: '/api/goods/reviews',
        method: 'GET',
        data: params,
      });
    },
  },
  user: {
    //阿里云oss
    async getOssSign(params = {}) {
      return wyy.request({
        url: '/api/user/oss/get_signature',
        method: 'GET',
        data: params,
      });
    },
    //钱包记录
    async deposits(params = {}) {
      return wyy.request({
        url: '/api/user/deposits',
        method: 'GET',
        data: params,
      });
    },
    //微信公众号授权Code
    async get_wx_code_url(params = {}) {
      return wyy.request({
        url: '/api/user/wexin/get_code_url',
        method: 'POST',
        data: params,
      });
    },
    //微信公众号授权登录
    async wxlogin(params = {}) {
      return wyy.request({
        url: '/api/user/wexin/login',
        method: 'POST',
        data: params,
      });
    },
    //密码修改：需用户登录
    async update_pwd(params = {}) {
      return wyy.request({
        url: '/api/user/update_pwd',
        method: 'POST',
        data: params,
      });
    },
    //个人认证
    async authentication(params = {}) {
      return wyy.request({
        url: '/api/user/authentication',
        method: 'POST',
        data: params,
      });
    },
    //获取个人中心信息
    async get_info(params = {}) {
      return wyy.request({
        url: '/api/user/get_info',
        method: 'GET',
        data: params,
      });
    },
    //会员卡
    async cards(params = {}) {
      return wyy.request({
        url: '/api/user/card/list',
        method: 'GET',
        data: params,
      });
    },
    async card_detail(params = {}) {
      return wyy.request({
        url: ' /api/user/card/detail',
        method: 'GET',
        data: params,
      });
    },
    //删除收货地址：需用户登录
    async delete_address(params = {}) {
      return wyy.request({
        url: '/api/user/receiver/delete',
        method: 'POST',
        data: params,
      });
    },
    //收货地址列表
    async address(params = {}) {
      return wyy.request({
        url: '/api/user/get_receivers',
        method: 'GET',
      });
    },
    //手机号修改提交：需用户登录
    async update_mobile(params = {}) {
      return wyy.request({
        url: '/api/user/update_mobile',
        method: 'POST',
        data: params,
      });
    },
    //修改收货地址
    async modify_address(params = {}) {
      return wyy.request({
        url: '/api/user/receiver/update',
        method: 'POST',
        data: params,
      });
    },
    //添加收货地址
    async add_address(params = {}) {
      return wyy.request({
        url: '/api/user/receiver/add',
        method: 'POST',
        data: params,
      });
    },
    //修改用户个人信息：需用户登录
    async update_info(params = {}) {
      return wyy.request({
        url: '/api/user/update_info',
        method: 'POST',
        data: params,
      });
    },
    //修改用户头像
    async update_avatar(params = {}) {
      return wyy.request({
        url: '/api/user/update_avatar ',
        method: 'POST',
        data: params,
      });
    },
    //提现
    async withdraw_apply(params = {}) {
      return wyy.request({
        url: '/api/user/withdraw/apply',
        method: 'POST',
        data: params,
      });
    },
    //获取默认收货地址
    async get_default_receiver(params = {}) {
      return wyy.request({
        url: '/api/user/get_default_receiver',
        method: 'GET',
        data: params,
      });
    },
    //我的消息：需用户登录
    async msgs(params = {}) {
      return wyy.request({
        url: '/api/user/get_msgs',
        method: 'GET',
        data: params,
      });
    },
    //我的钱包账户
    async wallet(params = {}) {
      return wyy.request({
        url: '/api/user/wallet',
        method: 'GET',
        data: params,
      });
    },
    points: {
      //我的积分账户
      async account(params = {}) {
        return wyy.request({
          url: '/api/user/points',
          method: 'GET',
          data: params,
        });
      },
      //充值明细
      async recharges(params = {}) {
        return wyy.request({
          url: '/api/user/points/recharges',
          method: 'GET',
          data: params,
        });
      },
      //消费明细
      async consumes(params = {}) {
        return wyy.request({
          url: '/api/user/points/consumes',
          method: 'GET',
          data: params,
        });
      },
    },
    //用户邀请
    invite: {
      async list(params = {}) {
        return wyy.request({
          url: '/api/mkt/invite/list',
          method: 'GET',
          data: params,
        });
      },
      async records(params = {}) {
        return wyy.request({
          url: '/api/user/invite/list',
          method: 'GET',
          data: params,
        });
      },
    }
  },
  card: {
    //权益卡详情
    async detail(params = {}) {
      return wyy.request({
        url: '/api/common/card/detail',
        method: 'GET',
        data: params,
      });
    },
  },
  order: {
    //立即购买
    async create(params = {}) {
      return wyy.request({
        url: '/api/oms/order/create',
        method: 'POST',
        data: params,
      });
    },
    //权益卡订单支付收款
    async createPaymentCard(params = {}) {
      return wyy.request({
        url: '/api/oms/payment/create_card',
        method: 'POST',
        data: params,
      });
    },
    //订单支付收款
    async payment(params = {}) {
      return wyy.request({
        url: '/api/oms/payment/create',
        method: 'POST',
        data: params,
      });
    },
    //获取订单支付状态
    async getPaymentStatus(params = {}) {
      return wyy.request({
        url: '/api/oms/payment/get_status',
        method: 'POST',
        data: params,
      });
    },
    //我的-订单包裹
    async packages(params = {}) {
      return wyy.request({
        url: '/api/oms/express/get_packages',
        method: 'GET',
        data: params,
      });
    },
    //我的订单列表-分页查询
    async getMyOrders(params = {}) {
      return wyy.request({
        url: '/api/user/order/list',
        method: 'GET',
        data: params,
      });
    },
    //订单详情
    async detail(params = {}) {
      return wyy.request({
        url: '/api/user/order/detail',
        method: 'GET',
        data: params,
      });
    },
    //我的订单包裹-物流信息
    async expressTrace(params = {}) {
      return wyy.request({
        url: '/api/oms/express/get_trace',
        method: 'GET',
        data: params,
      });
    },
    //取消订单
    async cancel(params = {}) {
      return wyy.request({
        url: '/api/user/order/cancel',
        method: 'POST',
        data: params,
      });
    },
  },
  ai: {
    //历史会话
    async chatList(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/list',
        method: 'GET',
        data: params,
      });
    },
    //会话详情
    async chatDetail(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/detail',
        method: 'GET',
        data: params,
      });
    },
    //创建会话
    async createChat(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/create',
        method: 'POST',
        data: params,
      });
    },
    //默认会话
    async defaultChat(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/default',
        method: 'POST',
        data: params,
      });
    },
    //删除会话
    async deleteChat(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/delete',
        method: 'POST',
        data: params,
      });
    },
    //清空对话
    async clearMsgs(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/clear_msgs',
        method: 'POST',
        data: params,
      });
    },
    //会话的所有对话
    async chatMsgs(params = {}) {
      return wyy.request({
        url: '/api/user/ai/chat/msgs',
        method: 'GET',
        data: params,
      });
    },
    image: {
      async generate(params = {}) {
        return wyy.request({
          url: '/api/user/ai/chat/gen_image',
          method: 'POST',
          data: params,
        });
      },
    },
    prompt: {
      async list(params = {}) {
        return wyy.request({
          url: '/api/ai/prompt/list',
          method: 'GET',
          data: params,
        });
      },
    },
    //预设
    preset: {
      async list(params = {}) {
          return wyy.request({
              url: '/api/ai/preset/list',
              method: "GET",
              data: params
          });
      },
    },
  },
};
