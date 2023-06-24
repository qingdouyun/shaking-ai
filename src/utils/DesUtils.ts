import configs from '@/constants/configs';
import CryptoJS from 'crypto-js';

const iv = 'AQIDBAUGBwg=';
const keyHex = CryptoJS.enc.Utf8.parse(configs.APPKEY);

export default class DesUtils {
  // 加密
  static encryptECB = (message) => {
    const keyHex = CryptoJS.enc.Utf8.parse(configs.APPKEY);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  };

  // 解密
  static decryptECB = (ciphertext) => {
    const keyHex = CryptoJS.enc.Utf8.parse(configs.APPKEY);
    const decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
      },
      keyHex,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  //解密
  static decrypCBC = (value) => {
    let ivHex = CryptoJS.enc.Base64.parse(iv);
    let decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(value),
      },
      keyHex,
      {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };
  //加密
  static encrypCBC = (value) => {
    let ivHex = CryptoJS.enc.Base64.parse(iv);
    let encrypted = CryptoJS.DES.encrypt(value, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };
}
