import React, { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import api from '@/services/api';
import DesUtils from '@/utils/DesUtils';
import Cookies from 'js-cookie';
import initNECaptcha from 'initNECaptcha';
import { ButtonCom, InputCom } from "@/components";
import Styles from "./index.module.less";
import Assets from "@/assets/images";
import cx from 'classnames';
import BaseUtils from '@/utils/BaseUtils';
import configs from '@/constants/configs';
import { parse } from 'query-string';
import { history } from 'umi';
import { Checkbox, Form, Input, message, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const RegisterPage = (props: any) => {
  const query = parse(history.location.search);
  const inviteCode = query.incode;
  const [form] = Form.useForm();
  const [isClick, setIsClick] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mobile, setMobile] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [time, setTimer] = useState('获取验证码');
  const [captchaIns, setCaptchaIns] = useState<any>({});
  const [isEye, setIsEye] = useState(false)
  const [isConfirmEye, setIsConfirmEye] = useState(false)
  const placeholderColor = 'rgba(0,0,0,0.3)'
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));

  //自己平台的图片验证码
  const [visible, setVisible] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState(configs.GetImageCaptcha);

  // 初始化方法
  useEffect(() => {
    api.init();
    if (BaseUtils.isEmpty(appInfo) || appInfo.expired < Date.now()) {
      api.app.getInfo({}).then((response: any) => {
        message.destroy();
        if (response.success) {
          response.data.expired = Date.now() + 30 * 60 * 1000;
          localStorage.setItem('appInfo', JSON.stringify(response.data));
          setAppInfo(response.data);
        } else {
          message.error(response.msg);
        }
      });
    }
    form.setFieldsValue({ incode: inviteCode });

    //网易行为验证码
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
    //           type: 'register',
    //           mobile: values.mobile,
    //           deviceType: 'wap',
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
    if (!reg.test(mobile)) {
      message.error('请输入正确的手机号码')
      return
    }
    setVisible(true);
    setCaptchaUrl(configs.GetImageCaptcha + "&d=" + Math.random());
  };

  /**
   * 图片验证码组件
   */
  const onImageCaptchaChange = () => {
    setCaptchaUrl(configs.GetImageCaptcha + "&d=" + Math.random());
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
      const values = form.getFieldsValue();
      api.msg.send_code({
        type: 'register',
        mobile: values.mobile,
        deviceType: 'H5',
        captchaId: sessionId,
        captcha: e.target.value,
      }).then((res) => {
        message.destroy();
        if (res.success) {
          tim();
          message.success(res.msg);
        }else{
          message.error(res.msg);
        }
      });
    }
  }

  //注册提交
  const submit = async () => {
    if (!agreement) {
      message.error('请先阅读协议并同意');
      return;
    }
    const values = await form.validateFields();

    if (BaseUtils.isEmpty(values.mobile)) {
      message.error('请输入手机号码')
      return
    }
    if (BaseUtils.isEmpty(values.password)) {
      message.error('请输入密码')
      return
    }
    if (BaseUtils.isEmpty(values.password2)) {
      message.error('请输入确认密码');
      return;
    }
    if (BaseUtils.isEmpty(values.code)) {
      message.error('请输入手机验证码');
      return;
    }
    if (values.password !== values.password2) {
      message.error('两次密码不同');
      return;
    }
    if (values.incode === undefined) {
      values.incode = '';
    }
    const enPassword = DesUtils.encrypCBC(Date.now() + values.password);
    setSubmitting(true);
    api.register({
      code: values.code,
      mobile: values.mobile,
      enPassword: enPassword,
      incode: values.incode,
    }).then((res) => {
      setSubmitting(false);
      message.destroy();
      if (res.success) {
        const userData = { ...res.data };
        Cookies.set('token', userData.token, { expires: 7 });
        delete userData.token;
        localStorage.setItem('userInfo', JSON.stringify(userData));
        message.success({
          content: res.msg,
        });
        history.push({
          pathname: '/',
        });
      } else {
        message.error({
          content: res.msg,
        });
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
            <div className={cx({ [Styles.label]: true, [Styles.noMargin]: true })}>手机号</div>
            <Form.Item
              name="mobile"
              className={Styles.item}
            >
              <InputCom placeholder="请输入手机号" placeholderColor={placeholderColor} borderBottom={true} clearable={true} onChange={(e) => { setMobile(e.target.value) }} />
            </Form.Item>

            <div className={Styles.label}>密码</div>
            <Form.Item
              className={Styles.item}
              name="password"
            >
              <InputCom
                type={isEye ? 'text' : 'password'}
                placeholder='请输入密码'
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

            <div className={Styles.label}>确认密码</div>
            <Form.Item
              className={Styles.item}
              name="password2"
            >
              <InputCom
                type={isConfirmEye ? 'text' : 'password'}
                placeholder='请确认密码'
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
                  <div className={Styles.getCode} onClick={getMsgCode} style={{ color: appInfo?.theme?.baseColor }}>{time}</div>
                )}
              />
            </Form.Item>

            <div className={Styles.label}>邀请码 (选填)</div>
            <Form.Item className={Styles.item} name="incode">
              <InputCom placeholder="请输入邀请码" placeholderColor={placeholderColor} borderBottom={true} clearable={true} />
            </Form.Item>
          </Form>

          <div className={Styles.attention}>
            <div style={{ fontSize: '13px', width: '100%' }}>注意：账户名称及密码仅支持英文大小写字母、数字组合、长度为6-16位</div>
          </div>

          <div className={Styles.fixedWrapper}>
            <ButtonCom text='注册' type='primary' block={true} height={48} background={appInfo?.theme?.baseColor} color='#fff' loading={submitting} onPress={submit} />
            <div className={Styles.agreement}>
              <Checkbox
                defaultChecked={agreement}
                onChange={(e: any) => {
                  console.log(e.target.checked);
                  setAgreement(e);
                }}
                style={{ marginRight: '4px' }}
              />
              <div style={{ whiteSpace: 'nowrap' }}>我已仔细阅读并同意</div>
              <span onClick={() => history.push('/register/privacy-policy')} style={{ color: appInfo?.theme?.baseColor, cursor: 'pointer' }}>
                《隐私政策》
              </span>
              与
              <span
                onClick={() =>
                  history.push('/register/user-service-agreement')
                }
                style={{ color: appInfo?.theme?.baseColor, cursor: 'pointer' }}
              >
                《用户服务协议》
              </span>
            </div>
          </div>
        </div>

        {/* 自己的图片验证码 */}
        <Modal
          title={`请完成安全验证`}
          style={{ top: '30%' }}
          bodyStyle={{ padding: 10 }}
          width={400}
          closable={true}
          visible={visible}
          footer={false}
          onCancel={() => { setVisible(false); }}
        >
          <>
            <div style={{ width: '100%', padding: '10px 20px' }}>
              <div style={{ height: '35px', display: 'flex', alignItems: 'center' }}>
                <Input placeholder='请输入图形验证码' clearable style={{ lineHeight: '30px', border: 0 }} onChange={onImageCaptchaInput} />
                <img onClick={onImageCaptchaChange} style={{ width: '90px', cursor: 'pointer', display: 'block', height: '32px' }} src={captchaUrl} />
                {/* <RedoOutline onClick={onImageCaptchaChange} /> */}
              </div>
              <div style={{ background: '#f0f0f0', width: '100%', height: '2px' }} />
              <div style={{ display: 'flex', color: 'gray', alignItems: 'center', height: '45px' }}>
                <ExclamationCircleFilled style={{ fontSize: '16px' }} />
                <p style={{ fontSize: '12px', margin: 0 }}>&nbsp;&nbsp;点击图片可刷新验证码</p>
              </div>
            </div>
          </>
        </Modal>

      </div>
    </>
  );
};

export default RegisterPage;
