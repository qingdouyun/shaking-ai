import React, { useEffect, useState} from 'react';
import api from '@/services/api';
import DesUtils from '@/utils/DesUtils';
import {ButtonCom, InputCom} from "@/components";
import Assets from '@/assets/images'
import Styles from "./index.module.less";
import { Form, message } from 'antd';
import { history } from '@umijs/max';

const RegisterPage = (props: any) => {
  const [form] = Form.useForm();
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [submitting, setSubmitting] = useState(false);
  const [isOldEye, setIsOldEye] = useState(false)
  const [isNewEye, setIsNewEye] = useState(false)
  const [isConfirmEye, setIsConfirmEye] = useState(false)


  const submit = async () => {
    const values = await form.validateFields();
    if(!values.oldPassword || !values.newPassword || !values.newPassword2) {
      message.error('请输入密码')
      return
    }
    if (values.newPassword != values.newPassword2) {
      message.error('两次密码不同');
      return;
    }
    setSubmitting(true);
    api.user.update_pwd({
        oldPassword: DesUtils.encrypCBC(Date.now() + values.oldPassword),
        password: DesUtils.encrypCBC(Date.now() + values.newPassword),
      }).then((res) => {
        setSubmitting(false);
        message.error(res.msg);
        if (res.success) {
          history.push('/user');
        }
      });
  };
  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>修改密码</p></div>
      <div className={Styles.modifyLogin}>
        <Form
          form={form}
          className={Styles.form}
        >
          <div className={Styles.label} style={{fontSize:'14px'}}>旧密码</div>
          <Form.Item
            name="oldPassword"
            className={Styles.item}
          >
            <InputCom
              type={isOldEye ? 'text' : 'password'}
              placeholder='请输入旧密码'
              borderBottom={true}
              clearable={false}
              extra={(
                <img
                  src={isOldEye ? Assets.eye : Assets.closeEye}
                  alt=""
                  className={Styles.inputIcon}
                  onClick={() => setIsOldEye(!isOldEye)}
                />
              )}
            />
          </Form.Item>

          <div className={Styles.label} style={{fontSize:'14px'}}>新密码</div>
          <Form.Item
            className={Styles.item}
            name="newPassword"
          >
            <InputCom
              type={isNewEye ? 'text' : 'password'}
              placeholder='请输入新密码'
              borderBottom={true}
              clearable={false}
              extra={(
                <img
                  src={isNewEye ? Assets.eye : Assets.closeEye}
                  alt=""
                  className={Styles.inputIcon}
                  onClick={() => setIsNewEye(!isNewEye)}
                />
              )}
            />
          </Form.Item>

          <div className={Styles.label} style={{fontSize:'14px'}}>确认新密码</div>
          <Form.Item
            className={Styles.item}
            name="newPassword2"
          >
            <InputCom
              type={isConfirmEye ? 'text' : 'password'}
              placeholder='请确认新密码'
              borderBottom={true}
              clearable={false}
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
        </Form>

        <div className={Styles.tip}>
          <div>*限6-20个字符以内，建议使用数字字母组合，区分大小写</div>
        </div>
        <ButtonCom text='确认' type='primary' loading={submitting} width={320} height={48} block={true} background={appInfo?.theme?.baseColor} color='#fff' onPress={submit} />
        <div className={Styles.forget} onClick={() => history.push('/forget')} style={{color:appInfo?.theme?.baseColor}}>忘记密码？</div>
      </div>
    </>
  );
};

export default RegisterPage;
