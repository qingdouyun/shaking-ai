import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  npmClient: 'yarn',
  antd: {},
  theme: {
    "@primary-color": "#1d93ab",
  },
  title: '抖动AI',
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
  },
  // favicons: ['https://cdn.pro.shakingcloud.com/qdy/logo/qdy-icon-logo.png'],//轻抖云AI开放平台
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  // layout: {
  //     title: '@umijs/max',//ProLayout布局与菜单
  // },

  //网易行为验证码 ---start
  headScripts: ['https://cstaticdun.126.net/load.min.js'],
  externals: {
    initNECaptcha: 'window.initNECaptcha',
  },
  //网易行为验证码 ---end

  // publicPath: 'https://cdn.pro.shakingcloud.com/saas/pc/kedou/v1/',//CDN静态资源存储地址

  metas: [
    { name: 'keywords', content: '抖动AI,chatgpt,chatgpt使用,chatgpt中文,midjourney,midjourney中文' },
    { name: 'description', content: '轻抖云AI开放平台专注AI人工智能ChatGPT,midjourney,文心,通义,混元,盘古等创新领域的研究和应用.' },
  ],
  routes: [...routes],
  proxy: {
    '/api/': {
      target: 'https://api.shakingcloud.com', // 正式环境
      // target: 'https://dev.shakingcloud.com', 
      // target: 'http://127.0.0.1',// 开发环境
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/common/': {
      target: 'https://api.shakingcloud.com', // 正式环境
      // target: 'https://dev.shakingcloud.com', // 开发环境
      // target: 'http://127.0.0.1',// 开发环境
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  }
});

