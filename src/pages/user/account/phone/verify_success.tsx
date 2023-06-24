import React, {useEffect, useState} from 'react';
import IconFont from '@/components/IconFont';
import api from '@/services/api';
import {ButtonCom, InputCom} from "@/components";
import Styles from "./index.module.less";
import { message, Result } from 'antd';


const RegisterPage = (props: any) => {
  const status = props.dataSource.status;
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [time, setTimer] = useState('获取验证码');
  const [isClick, setIsClick] = useState(true);
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [submitting, setSubmitting] = useState(false);

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
    if (phone === '') {
      message.error('请填写手机号');
      return;
    } else {
      if (isClick) {
        message.loading({content: '正在发送',duration: 0,});
        api.msg.send_code({ mobile: phone, type: 'update_mobile_new_mobile' }).then((res) => {
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
    }
  };

  const submit = () => {
    if (phone === '') {
      message.error('请填写手机号');
      return;
    }
    if (code === '') {
      message.error('请填写验证码');
      return;
    }
    setSubmitting(true);
    api.user.update_mobile({ code: code, newMobile: phone }).then((res) => {
      message.destroy();
      setSubmitting(false);
      if (res.success) {
        message.success(res.msg);
        setTimeout(() => {
          location.reload();
        }, 500);
      }else{
        message.error(res.msg);
      }
    });
  };

  return (
    <>
      {status?
        <div>
          <div className={Styles.acModifyVerified}>

            <div className={Styles.item}>
              <div className={Styles.label} style={{fontSize:'14px'}}>手机号</div>
              <InputCom placeholder='请输入您的新手机号' classname={Styles.input} clearable={false} borderBottom={true} onChange={(e)=>{setPhone(e.target.value)}} />
            </div>

            <div className={Styles.item}>
              <div className={Styles.label} style={{fontSize:'14px'}}>验证码</div>
              <InputCom
                placeholder="请输入验证码"
                classname={Styles.input}
                clearable={false}
                onChange={(e)=>{setCode(e.target.value)}}
                borderBottom={true}
                extra={(
                  <div className={Styles.getCode} onClick={sendCode} style={{color:appInfo?.theme?.baseColor,fontSize:'14px'}}>{time}</div>
                )}
              />
            </div>

            <div className={Styles.hint}>
              <IconFont
                icon="icon-youqingtishi"
                style={{
                  fontSize: '12px',
                  marginRight: '12px',
                  margin: '0',
                  color: '#3974F6',
                }}
              />
              <span style={{fontSize:'12px'}}>
                温馨提示：手机号修改属高危操作，请确定是本人操作，修改后新手机号将于下次登陆生效。
              </span>
            </div>

            <ButtonCom text='确认提交' type='primary' loading={submitting} width={320} height={48} block={true} background={appInfo?.theme?.baseColor} color='#fff' onPress={submit}/>
          </div>
        </div>
      :<Result status="warning" title="无权限操作"/>}
    </>
  );
};

export default RegisterPage;
