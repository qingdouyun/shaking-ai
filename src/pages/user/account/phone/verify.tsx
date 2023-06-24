import React, {useEffect, useState} from 'react';
import api from '@/services/api';
import {ButtonCom, InputCom} from "@/components";
import Styles from "./index.module.less";

import VerifySuccess from './verify_success';
import { message } from 'antd';

const RegisterPage = (props: any) => {
  const mobile = props.dataSource.mobile;
  const [time, setTimer] = useState('获取验证码');
  const [isClick, setIsClick] = useState(true);
  const [code, setCode] = useState('');
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));

  const [nextStep, setNextStep] = useState('current');

  //倒计时
  const tim = () => {
    setIsClick(false);
    let index = 30;
    let timer = setInterval(() => {
      index--;
      setTimer(String(index));
      if (index <= 0) {
        clearInterval(timer);
        index = 30;
        setTimer('获取验证码');
        setIsClick(true);
      }
    }, 1000);
  };
  const sendCode = () => {
    if (isClick) {
      message.loading({content: '正在发送',duration: 0,});
      api.msg.send_code({ mobile: mobile, type: 'update_mobile' }).then((res) => {
          message.destroy();
          if (res.success) {
            message.success(res.msg);
            tim();
          }else{
            message.error(res.msg);
          }
      });
    } else {
      message.error('请稍后尝试');
    }
  };
  const checkCode = () => {
    if (code === '') {
      message.error('请输入验证码');
      return;
    }
    message.loading({content: '正在校验',duration: 0,});
    api.msg.check_code({ code: code }).then((res) => {
      message.destroy();
      if (res.success) {
        message.success(res.msg);
        setNextStep('success');
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <>
    {nextStep === 'success'?<VerifySuccess dataSource={{'status':true}}/>:
      <div className={Styles.accountVerification} >
        <div className={Styles.title} style={{fontSize:'16px'}}>账号验证</div>
        <div className={Styles.text} style={{fontSize:'14px'}}>{mobile}</div>
        <InputCom
          placeholder="请输入验证码"
          borderBottom={true}
          clearable={false}
          onChange={(e)=>{setCode(e.target.value)}}
          extra={(
            <div className={Styles.getCode} onClick={sendCode} style={{color:appInfo?.theme?.baseColor,fontSize:'14px'}}>{time}</div>
          )}
        />

        <ButtonCom className={Styles.buttonWrapper} text='下一步' type='primary' block={true} width={320} height={48} background={appInfo?.theme?.baseColor} color='#fff' onPress={checkCode} />
      </div>
      }
    </>
  );
};

export default RegisterPage;
