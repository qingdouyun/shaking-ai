import React, { useState, useEffect } from 'react';
import {ButtonCom} from "@/components";
import Styles from "./index.module.less";
import { history } from '@umijs/max';
import Verify from './verify';
import { Alert } from 'antd';

const RegisterPage = (props: any) => {
  const [mobile, setMobile] = useState('');
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息

  const [contentType, setContentType] = useState('index');

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    setMobile(JSON.parse(userInfo || '').mobile);
  }, []);

  //监听点击
  const next = () => {
    setContentType('verify');
  }

  //渲染内容
  const renderContent = () => {
    if (contentType === 'index') {
      return <div className={Styles.modifyPhone} >
                <div className={Styles.title} style={{fontSize:'16px'}}>当前绑定手机号</div>
                <div
                  className={Styles.text}
                  style={{fontSize:'14px'}}
                >
                  {mobile}
                </div>
                <ButtonCom text='手机换绑' type='primary' className={Styles.buttonWrapper} width={320} height={48} block={true} background={appInfo?.theme?.baseColor} color='#fff' onPress={next} />
              </div>
    }else if (contentType === 'verify') {
      return <Verify dataSource={{'mobile': mobile}}/>
    }
  }

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>更换手机</p></div>
      <Alert message='注：当前手机号更换，仅仅只是更换绑定的手机号，登录账号不会被变更！' type='warning' />
      {renderContent()}
    </>
  );
};

export default RegisterPage;
