import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import DesUtils from '@/utils/DesUtils';
import api from '@/services/api';
import Styles from './index.module.less'
import {ButtonCom, InputCom} from "@/components";
import Assets from '@/assets/images';
import BaseUtils from '@/utils/BaseUtils';
import configs from '@/constants/configs';
import { Form, Input, message, Modal } from 'antd';
import {history} from "umi";
import { parse } from 'query-string';
import { ExclamationCircleFilled } from '@ant-design/icons';

const LoginPage = (props: any) => {
  const query = parse(history.location.search);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isEye, setIsEye] = useState(false);
  const placeholderColor = 'rgba(0,0,0,0.3)';
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [loginType, setLoginType] = useState('account');//account账号密码登录，mobileCaptcha手机验证码登录
  const [captcha, setCaptcha] = useState('');

  
  useEffect(() => {
    api.init();
    if (BaseUtils.isEmpty(appInfo) || appInfo.expired < Date.now() ) {
      api.app.getInfo({}).then((response: any) => {
        message.destroy();
        if (response.success) {
          response.data.expired = Date.now() + 30*60*1000;
          localStorage.setItem('appInfo',JSON.stringify(response.data));
          setAppInfo(response.data);
        } else {
          message.error(response.msg);
        }
      });
    }
  }, []);

  //验证码登录切换
  const onLoginType = () => {
    setLoginType(loginType==='account'?'mobileCaptcha':'account');
  }


  //图片验证码组件 ---start
  const [isClick, setIsClick] = useState(true);
  const [visible, setVisible] =useState(false);
  const [time, setTimer] = useState('获取验证码');
  const [captchaUrl, setCaptchaUrl] = useState(configs.GetImageCaptcha+Cookies.get('SESSIONID'));
  const tim = () => {
    setIsClick(false);
    let index = 60;
    let timer = setInterval(() => {
      index--;
      setTimer(String(index));
      if (index <= 0) {
        clearInterval(timer);
        index = 60;
        setTimer('获取验证码');
        setIsClick(true);
      }
    }, 1000);
  };

  //获取短信验证码
  const getMsgCode = async () => {
    if (!isClick) {
      message.error('请稍后尝试');
      return;
    }
    const values = await form.validateFields();
    if (values.account === '') {
      message.error('请输入手机号');
      return;
    }
    let reg = /^1[3-9]\d{9}$/
    if(!reg.test(values.account)) {
      message.error('请输入正确的手机号码')
      return
    }
    setVisible(true);
    setCaptchaUrl(configs.GetImageCaptcha+Cookies.get('SESSIONID')+"&d="+Math.random());
  };

  /**
   * 图片验证码组件
   */
  const onImageCaptchaChange = () => {
    setCaptchaUrl(configs.GetImageCaptcha+Cookies.get('SESSIONID')+"&d="+Math.random());
  }

  //监听图片验证码输入
  const onImageCaptchaInput = (e: any) => {
    if (e.target.value.length === 4) {
      const sessionId = Cookies.get('SESSIONID');
      setVisible(false);
      message.loading({
        content: '正在发送',
        duration: 0,
      });
      // console.log(sessionId);
      const values = form.getFieldsValue();
      api.msg.send_code({
            type: 'login',
            mobile: values.account,
            deviceType: 'H5',
            captchaId: sessionId,
            captcha: e.target.value,
      }).then((res) => {
          message.destroy();
          message.error(res.msg);
          if (res.success) {
            tim();
          }
      });
    }
  }
  //图片验证码组件 ---end

  const submit = async () => {
    const values = await form.validateFields();
    if(!values.account) {
      message.error('请输入您的账号')
      return
    }
    if (loginType === 'account') {
      if (!values.password) {
        message.error('请输入账号密码')
        return
      }
    }
    if (loginType === 'mobileCaptcha') {
      if (!values.code) {
        message.error('请输入手机验证码')
        return
      }
    }
    setSubmitting(true);
    if (loginType === 'account') {
      const enPassword = DesUtils.encrypCBC(Date.now() + values.password);
      api.login({ 'account': values.account, enPassword: enPassword }).then((response: any) => {
          setSubmitting(false);
          if (response.success) {
            const userData = { ...response.data };
            Cookies.set('token', userData.token, { expires: 7 });
            delete userData.token;
            localStorage.setItem('userInfo', JSON.stringify(userData));
            message.success({
              content: response.msg,
            });
            let url = '/user/index';
            if (!BaseUtils.isEmpty(query?.redirect)) {
              url = query?.redirect;
            }
            history.push({ 'pathname': url });
          } else {
            message.error({
              content: response.msg,
            });
          }
      });
    }else if (loginType === 'mobileCaptcha') {
      api.login_by_code({ 'mobile': values.account, 'code': values.code }).then((response: any) => {
        setSubmitting(false);
        if (response.success) {
          const userData = { ...response.data };
          Cookies.set('token', userData.token, { expires: 7 });
          delete userData.token;
          localStorage.setItem('userInfo', JSON.stringify(userData));
          message.success({
            content: response.msg,
          });
          let url = '/user/index';
            if (!BaseUtils.isEmpty(query?.redirect)) {
              url = query?.redirect;
            }
            history.push({ 'pathname': url });
        } else {
          message.error({
            content: response.msg,
          });
        }
    });
    }
  };

  return (
    <>
      <div className={Styles.container} style={{background:appInfo?.theme?.bgColor}}>
        <div className={Styles.loginWrapper}>
          <div className={Styles.loginInput}>
            <Form form={form}>
              <Form.Item
                name="account"
              >
                <InputCom placeholder='请输入账号' borderBottom={true} clearable={true} />
              </Form.Item>
              <Form.Item
                name="password"
                hidden={loginType==='mobileCaptcha'}
              >
                <InputCom
                  type={isEye ? 'text' : 'password'}
                  placeholder='请输入密码'
                  borderBottom={true}
                  clearable={true}
                  classname={Styles.input}
                  onEnterPress={submit}
                  extra={(
                    <img
                      src={isEye ? Assets.eye : Assets.closeEye}
                      alt=""
                      className={Styles.inputIcon}
                      onClick={() => setIsEye(!isEye)}
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                className={Styles.item}
                name="code"
                hidden={loginType==='account'}
              >
                <InputCom
                  placeholder="请输入验证码"
                  placeholderColor={placeholderColor}
                  borderBottom={true}
                  clearable={true}
                  extra={(
                    <div className={Styles.getCode} onClick={getMsgCode} style={{color:appInfo?.theme?.baseColor}}>{time}</div>
                  )}
                />
              </Form.Item>
              <div className={Styles.tip} onClick={() => history.push('/forget')} hidden={loginType==='mobileCaptcha'}>忘记密码 ?</div>
            </Form>
              
            <div className={Styles.buttonWrapper}>
              <ButtonCom text='登录' type='primary' loading={submitting} height={48} block={true} background={appInfo?.theme?.baseColor} color='#fff' onPress={submit} />
            </div>
          </div>
          <div onClick={() => onLoginType()} style={{marginTop:'30px',fontWeight:520, color:appInfo?.theme?.baseColor,fontSize:'14px',cursor:'pointer'}}>{loginType==='account'?'验证码登录':'账号密码登录'}</div>
          <div className={Styles.tipRegister}>还没有账号, <span onClick={() => history.push('/register')} className={Styles.text} style={{color:appInfo?.theme?.baseColor}}>立即注册</span></div>
        </div>
      </div>

      {/* 自己的图片验证码 */}
      <Modal
        title={`请完成安全验证`}
        style={{top:'30%'}}
        bodyStyle={{padding:10}}
        width={400}
        closable={true}
        visible={visible}
        footer={false}
        onCancel={() => {setVisible(false);}}
      >
        <>
          <div style={{width:'100%',padding:'10px 20px'}}>
            <div style={{height:'35px',display:'flex',alignItems:'center'}}>
              <Input placeholder='请输入图形验证码' clearable style={{lineHeight:'30px',border:0,textAlign:'left'}} onChange={onImageCaptchaInput}/>
              <img onClick={onImageCaptchaChange} style={{ width: '90px',cursor:'pointer',display:'block',height:'32px' }} src={captchaUrl} />
              {/* <RedoOutline onClick={onImageCaptchaChange} /> */}
            </div>
            <div style={{background:'#f0f0f0',width:'100%',height:'2px'}}/>
            <div style={{display:'flex',color:'gray',alignItems:'center',height:'45px'}}>
              <ExclamationCircleFilled style={{fontSize:'16px'}}/>
              <p style={{fontSize:'12px',margin:0}}>&nbsp;&nbsp;点击图片可刷新验证码</p>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default LoginPage;
