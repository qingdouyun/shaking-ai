/**
 * 路由配置
 * 更多路由请查询 https://umijs.org/zh-CN/docs/routing
 */
export default [
  {
    path: '/',
    component: '@/layouts/BasicLayout', // 采用umi 约定的全局路由， 因为umi不能针对不同的路由配置不同的 layout，所以需要在全局的layout中特殊处理。
    routes: [
      {
        exact: true,
        path: '/',
        title: '首页',
        component: './index',
      },
      {
        path: '/*',
        component: './404',
      },
      {
        path: '/**/*',
        redirect: '/404',
      },
      {
        path: '/login',
        component: './login',
      },
      {
        path: '/forget',
        component: './forget',
      },
      {
        path: '/login/weixin',
        component: './login/weixin',
      },
      {
        path: '/register',
        component: './register',
      },
      {
        path: '/chat',
        component: './chat',
      },
      {
        path: '/chat/imager',
        component: './chat/imager',
      },
      // 隐私政策
      {
        path: '/register/privacy-policy',
        component: './register/PrivacyPolicy',
      },
      // 用户服务协议
      {
        path: '/register/user-service-agreement',
        component: './register/UserServiceAgreement',
      },
      {
        path: '/custom',
        name: '自定义页面',
        routes: [
          {
            path: '/custom/page1',
            component: './custom/page1',
          },
          {
            path: '/custom/page2',
            component: './custom/page2',
          },
          {
            path: '/custom/page3',
            component: './custom/page3',
          },
          {
            path: '/custom/page4',
            component: './custom/page4',
          },
          {
            path: '/custom/page5',
            component: './custom/page5',
          },
          {
            path: '/custom/page6',
            component: './custom/page6',
          },
          {
            path: '/custom/page7',
            component: './custom/page7',
          },
          {
            path: '/custom/page8',
            component: './custom/page8',
          },
          {
            path: '/custom/page9',
            component: './custom/page9',
          },
          {
            path: '/custom/page10',
            component: './custom/page10',
          },
        ]
      },
      {
        path: '/notice',
        name: '公告',
        routes: [
          {
            path: '/notice/list',
            component: './notice/list',
          },
          {
            path: '/notice/detail/:key',
            component: './notice/detail',
          },
        ],
      },
      {
        path: '/article',
        name: '文章',
        routes: [
          {
            path: '/article/detail/:key',
            component: './article/detail',
          },
        ],
      },
      {
        path: '/card',
        name: '权益卡',
        routes: [
          {
            path: '/card/detail/:key',
            component: './card/detail',
          },
          {
            path: '/card/checkout',
            component: './card/checkout',
          },
          // {
          //   path: '/card/pay',
          //   component: './card/pay',
          // },
        ],
      },
      {
        path: '/goods',
        name: '商品',
        routes: [
          {
            path: '/goods/detail/:key',
            component: './goods/detail',
          },
          {
            path: '/goods/checkout',
            component: './goods/checkout',
          },
          {
            path: '/goods/comments',
            component: './goods/comments',
          },
          {
            path: '/goods/checkout/pay',
            component: './goods/checkout/pay',
          },
          {
            path: '/goods/receiver/list',
            component: './goods/receiver/list',
          },
          {
            path: '/goods/receiver/add',
            component: './goods/receiver/add',
          },
          {
            path: '/goods/receiver/modify',
            component: './goods/receiver/modify',
          },
          // {
          //   path: '/goods/checkout/pay',
          //   component: './goods/checkout/pay',
          // },
        ],
      },
      {
        path: '/user',
        name: '会员中心',
        component: '@/layouts/UserLayout',
        routes: [
          {
            path: '/user/index',
            component: './user/index',
          },
          {
            path: '/user/profile',
            component: './user/profile',
          },
          {
            path: '/user/account/password',
            component: './user/account/password',
          },
          {
            path: '/user/account/phone',
            component: './user/account/phone',
          },
          {
            path: '/user/order/list',
            component: './user/order/list',
          },
          {
            path: '/user/order/detail/:key',
            component: './user/order/detail',
          },
          {
            path: '/user/receiver/list',
            component: './user/receiver/list',
          },
          {
            path: '/user/receiver/add',
            component: './user/receiver/add',
          },
          {
            path: '/user/receiver/edit',
            component: './user/receiver/modify',
          },
          {
            path: '/user/wallet',
            component: './user/wallet',
          },
          {
            path: '/user/wallet/deposit',
            component: './user/wallet/deposit',
          },
          {
            path: '/user/card/list',
            component: './user/card/list',
          },
          {
            path: '/user/card/detail/:key',
            component: './user/card/detail',
          },
          {
            path: '/user/points',
            component: './user/points',
          },
          {
            path: '/user/points/recharge',
            component: './user/points/recharge',
          },
          {
            path: '/user/points/consume',
            component: './user/points/consume',
          },
          {
            path: '/user/share',
            component: './user/share',
          },
        ],
      },
    ]
  },
];
