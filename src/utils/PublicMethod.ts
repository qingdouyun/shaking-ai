/**
 * 标准时间转年月日时间
 * @param {*} date
 * @returns
 */
export const time = (date) => {
  const d = new Date(date); // 处理苹果日期格式

  const datetime =
    d.getFullYear() +
    '-' +
    (d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '-' +
    (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
    ' ' +
    (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
    ':' +
    (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
    ':' +
    (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());

  return datetime;
};

/**
 * 转化utc时间
 * @param {*} datetime
 * @param {*} dateSeprator
 * @param {*} timeSeprator
 * @returns
 */
export function transTimestamp(
  datetime,
  dateSeprator = '-',
  timeSeprator = ':',
) {
  if (datetime) {
    const date = new Date(datetime);
    const year = `${date.getUTCFullYear()}`;
    let month = `${date.getUTCMonth() + 1}`;
    let day = `${date.getUTCDate()}`;
    let hour = `${date.getUTCHours()}`;
    let minute = `${date.getUTCMinutes()}`;
    let second = `${date.getUTCSeconds()}`;

    if (month.length === 1) {
      month = `0${month}`;
    }
    if (day.length === 1) {
      day = `0${day}`;
    }
    if (day.length === 1) {
      day = `0${day}`;
    }
    if (hour.length === 1) {
      hour = `0${hour}`;
    }
    if (minute.length === 1) {
      minute = `0${minute}`;
    }
    if (second.length === 1) {
      second = `0${second}`;
    }
    return `${year}${dateSeprator}${month}${dateSeprator}${day} ${hour}${timeSeprator}${minute}${timeSeprator}${second}`;
  }
}

/**
 * 合成图片
 * @param {*} posterImg
 * @param {*} qrCode
 * @returns
 */
export const drawAndShareImage = (posterImg, qrCode) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const myImage = new Image();
    myImage.crossOrigin = 'Anonymous';
    // myImage.setAttribute('crossOrigin', 'Anonymous');
    myImage.src = `${posterImg}?time=${new Date().valueOf()}`; //海报图片 本地的图片或者在线图片
    myImage.onload = function () {
      canvas.width = myImage.width;
      canvas.height = myImage.height;
      const context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#fff';
      context.fill();
      context.drawImage(myImage, 0, 0, myImage.width, myImage.height);
      const myImage2 = new Image();
      myImage2.crossOrigin = 'Anonymous';
      // myImage2.setAttribute('crossOrigin', 'Anonymous');
      myImage2.src = qrCode;
      myImage2.onload = function () {
        context.drawImage(
          myImage2,
          // myImage.width - 800,
          // myImage.height - 268,
          myImage.width - 366,
          myImage.height - 356,
          320,
          320,
        );
        const base64 = canvas.toDataURL('image/png'); //"image/png" 这里注意一下
        resolve(base64);
      };
    };
  });
};

/**
 * 下载图片
 * @param {*} downloadName
 * @param {*} url
 */
export const downLoad = (downloadName, url) => {
  const tag = document.createElement('a');
  // 此属性的值就是**时图片的名称，注意，名称中不能有半角点，否则**时后缀名会错误
  tag.setAttribute('download', downloadName.replace(/\./g, '。'));

  const image = new Image();
  image.src = url;
  //重要，设置 crossOrigin 属性，否则图片跨域会报错
  image.setAttribute('crossOrigin', 'Anonymous');
  // 图片未加载完成时操作会报错
  image.onload = () => {
    tag.href = getImageDataURL(image);
    tag.click();
  };
};

/**
 * 获取图片的dataURL
 * @param {*} image
 * @returns
 */
const getImageDataURL = (image) => {
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  // 以图片为背景剪裁画布
  ctx.drawImage(image, 0, 0, image.width, image.height);
  // 获取图片后缀名
  const extension = image.src
    .substring(image.src.lastIndexOf('.') + 1)
    .toLowerCase();
  // 某些图片 url 可能没有后缀名，默认是 png
  return canvas.toDataURL('image/' + extension, 1);
};

/**
 * 生成uuid的方法
 * @returns
 */
export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 生成x - x的随机数方法
 * @returns
 */
export const getRandomNumberByRange = (start, end) =>
  Math.floor(Math.random() * (end - start) + start);

/**
 * 判断是否在微信浏览器
 * @returns
 */
export function is_weixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  }
  return false;
}

// 获取当前年月日
export const getTime = () => {
  const d = new Date();

  const datetime =
    d.getFullYear() +
    '-' +
    (d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '-' +
    (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());

  return datetime;
};

/**
 * 三位加逗号
 * @param {*} num
 * @returns
 */
export const formatNumber = (num) => Number(num).toLocaleString();

/**
 * android&ios原生返回
 * @param {*} callback
 * @returns
 */
export const setupWebViewJavascriptBridge = (callback) => {
  ///Android端
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function () {
        callback(WebViewJavascriptBridge);
      },
      false,
    );
  }

  //iOS端
  // if (window.WVJBCallbacks) {
  //   return window.WVJBCallbacks.push(callback);
  // }
  // window.WVJBCallbacks = [callback];
  // var WVJBIframe = document.createElement('iframe');
  // WVJBIframe.style.display = 'none';
  // WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  // document.documentElement.appendChild(WVJBIframe);
  // setTimeout(function () {
  //   document.documentElement.removeChild(WVJBIframe);
  // }, 0);
  if (window.WKWebViewJavascriptBridge) {
    return callback(WKWebViewJavascriptBridge);
  }
  if (window.WKWVJBCallbacks) {
    return window.WKWVJBCallbacks.push(callback);
  }
  window.WKWVJBCallbacks = [callback];
  window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
};

//是否安卓原生端
export const is_anroid = () => {
  const u = navigator.userAgent;

  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    return 'ios';
  } else {
    return 'Android';
  }
};

export const goBack = () => {
  setupWebViewJavascriptBridge(function (bridge) {
    //安卓端必须加上这一句初始化，不然registerHandler接收不到来自原生的消息，iOS不影响
    if (is_anroid().includes(['Android'])) {
      bridge.init(function (message, responseCallback) {});
    }

    bridge.callHandler('pop', null, function (resp) {}); // 返回上一层 等于返回功能
  });
};

export const drawAndShare = (posterImg, qrCode) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const myImage = new Image();
    myImage.crossOrigin = 'Anonymous';
    myImage.src = `${posterImg}?time=${new Date().valueOf()}`; //海报图片 本地的图片或者在线图片
    myImage.onload = function () {
      canvas.width = myImage.width;
      canvas.height = myImage.height;
      const context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#f00';
      context.fill();
      context.drawImage(myImage, 0, 0, myImage.width, myImage.height);
      const myImage2 = new Image();
      myImage2.crossOrigin = 'Anonymous';
      myImage2.src = qrCode;
      myImage2.onload = function () {
        context.drawImage(
          myImage2,
          myImage.width / 2 - 150,
          myImage.height / 2 - 150,
          300,
          300,
        );
        const base64 = canvas.toDataURL('image/png'); //"image/png" 这里注意一下
        resolve(base64);
      };
    };
  });
};
