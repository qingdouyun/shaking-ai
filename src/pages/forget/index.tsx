import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import DesUtils from '@/utils/DesUtils';
import initNECaptcha from 'initNECaptcha';
import {InputCom, ButtonCom} from "@/components";
import Styles from "./index.module.less";
import Assets from "@/assets/images";
import configs from '@/constants/configs';
import BaseUtils from '@/utils/BaseUtils';
import Cookies from 'js-cookie';
import { Form, Input, message, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { history } from '@umijs/max';

const RegisterPage = (props: any) => {
  const [form] = Form.useForm();
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [isClick, setIsClick] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mobile, setMobile] = useState('');
  const [time, setTimer] = useState('获取验证码');
  const [captchaIns, setCaptchaIns] = useState<any>({});
  const [isEye, setIsEye] = useState(false)
  const [isConfirmEye, setIsConfirmEye] = useState(false)
  const placeholderColor = 'rgba(0,0,0,0.3)';


  // 初始化方法
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
    // let ins: any;
    // initNECaptcha(
    //   {
    //     element: '#captcha',
    //     captchaId: '123456789',
    //     width: '320px',
    //     mode: 'popup',
    //     onVerify: function (err: any, data: any) {
    //       if (err) return;
    //       message.error({
    //         icon: 'loading',
    //         content: '正在发送',
    //         duration: 0,
    //       });
    //       const values = form.getFieldsValue();
    //       api.msg
    //         .send_code({
    //           type: 'find_password',
    //           mobile: values.mobile,
    //           captcha: data.validate,
    //         })
    //         .then((res) => {
    //           message.error(res.msg);
    //           if (res.success) {
    //             tim();
    //           }
    //           ins && ins.refresh();
    //         });
    //     },
    //   },
    //   function onload(instance: any) {
    //     ins = instance;
    //     setCaptchaIns(instance);
    //   },
    //   function onerror(err: any) {
    //     console.warn(err);
    //   },
    // );
  }, []);

  
  //图片验证码组件 ---start
  const [visible, setVisible] =useState(false);
  const [captchaUrl, setCaptchaUrl] = useState(configs.GetImageCaptcha);
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
  const getMsgCode = () => {
    if (!isClick) {
      message.error('请稍后尝试');
      return;
    }
    if (mobile === '') {
      message.error('请输入手机号');
      return;
    }
    let reg = /^1[3-9]\d{9}$/
    if(!reg.test(mobile)) {
      message.error('请输入正确的手机号码')
      return
    }
    setVisible(true);
    setCaptchaUrl(configs.GetImageCaptcha+"&d="+Math.random());
  };

  /**
   * 图片验证码组件
   */
  const onImageCaptchaChange = () => {
    setCaptchaUrl(configs.GetImageCaptcha+"&d="+Math.random());
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
            type: 'find_password',
            mobile: values.mobile,
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

    if(!values.mobile || !values.password || !values.password2 || !values.code) {
      message.error('请输入完整信息')
      return
    }

    if (values.password.length < 6) {
      message.error('密码过短');
      return;
    }
    if (values.password !== values.password2) {
      message.error('两次密码不同');
      return;
    }
    const enPassword = DesUtils.encrypCBC(Date.now() + values.password);
    setSubmitting(true);
    api.forget({
        code: values.code,
        mobile: values.mobile,
        enPassword: enPassword,
      }).then((res) => {
        setSubmitting(false);
        if (res.success) {
          message.success({ content: res.msg});
          setTimeout(() => {
            history.push({ pathname: '/login' });
          }, 500);
        } else {
          message.error({ content: res.msg});
        }
    });
  };

  return (
    <>
      <div className={Styles.register} style={{background:appInfo?.theme?.bgColor}}>
        <div id="captcha"></div>
        <div className={Styles.contentWrapper}>
          <Form
            form={form}
            className={Styles.form}
          >
            <div className={Styles.label}>手机号</div>
            <Form.Item
              name="mobile"
              className={Styles.item}
            >
              <InputCom placeholder="请输入手机号" placeholderColor={placeholderColor} borderBottom={true} clearable={true} onChange={(e)=>{setMobile(e.target.value)}}/>
            </Form.Item>

            <div className={Styles.label}>新密码</div>
            <Form.Item
              className={Styles.item}
              name="password"
            >
              <InputCom
                type={isEye ? 'text' : 'password'}
                placeholder='请输入新密码'
                placeholderColor={placeholderColor}
                borderBottom={true}
                clearable={true}
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

            <div className={Styles.label}>确认新密码</div>
            <Form.Item
              className={Styles.item}
              name="password2"
            >
              <InputCom
                type={isConfirmEye ? 'text' : 'password'}
                placeholder='请确认新密码'
                placeholderColor={placeholderColor}
                borderBottom={true}
                clearable={true}
                extra={(
                  <img
                    src={isConfirmEye ? Assets.eye : Assets.closeEye}
                    alt=""
                    className={Styles.inputIcon}
                    onClick={() => setIsConfirmEye(!isConfirmEye)}
                  />
                )}
              />
            </Form.Item>

            <div className={Styles.label}>验证码</div>
            <Form.Item
              className={Styles.item}
              name="code"
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
          </Form>

          <div className={Styles.attention}>
            <div style={{fontSize:'14px'}}>注意：账户名称及密码仅支持英文大小写字母、数字组合、长度为6-16位</div>
          </div>

          <div className={Styles.fixedWrapper}>
            <ButtonCom text='重置密码' type='primary' block={true} height={48} loading={submitting} background={appInfo?.theme?.baseColor} color='#fff' onPress={submit} />
          </div>
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
              <Input placeholder='请输入图形验证码' clearable style={{lineHeight:'30px',border:0}} onChange={onImageCaptchaInput}/>
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

export default RegisterPage;
