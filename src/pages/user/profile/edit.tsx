import React, {useEffect, useState} from 'react';
import {ButtonCom, InputCom} from "@/components";
import Styles from "./index.module.less";
import api from "@/services/api";
import { message } from 'antd';

/** 修改昵称 */
const EditNickname = (props: any) => {
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [nickname, setNickname] = useState('');
  const [autograph, setAutograph] = useState('');
  const placeholderColor = 'rgba(0,0,0,0.3)';
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    setNickname(userInfo.nickname);
    setAutograph(userInfo.autograph);
  }, [])

  const submit = () => {
    if(!nickname) {
      message.error('请填写昵称')
      return
    }
    if(!autograph) {
      message.error('请填写个性签名')
      return
    }
    let nicknameStr = nickname.trim()
    if(nicknameStr.length > 10) {
      message.error('昵称不能超过10个字符')
      return
    }
    let autographStr = autograph.trim()
    if(autographStr.length > 20) {
      message.error('个性签名不能超过20个字')
      return
    }
    if (
      /[`~!@#$%^&*()+=|{}':;'，/\/\\[\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]|[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/.test(
        nicknameStr,
      )
    ) {
      message.error('该字段含有特殊符号,请认真填写');
      return;
    }
    setSubmitting(true);
    api.user.update_info({ 'nickname': nicknameStr,'autograph':autographStr }).then((res) => {
      setSubmitting(false);
      if (res.success) {
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        message.success(res.msg);
        props.onChange('info');
      }else{
        message.error(res.msg);
      }
    });
  }

  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.label} style={{fontSize:'14px'}}>昵称</div>
        <InputCom value={nickname} placeholder='记得填写昵称' placeholderColor={placeholderColor} clearable={false} borderBottom={true} onChange={(e)=>{setNickname(e.target.value)}} />
        <div className={Styles.tip}>
          <div style={{fontSize:'13px'}}>*限5个字符以内，支持中英文数字及下划线</div>
        </div>

        <div className={Styles.label} style={{fontSize:'14px'}}>个性签名</div>
        <InputCom value={autograph} placeholder='记得填写个性签名' placeholderColor={placeholderColor} clearable={false} borderBottom={true} onChange={(e)=>{setAutograph(e.target.value)}} />
        <div className={Styles.tip}>
          <div style={{fontSize:'13px'}}>*限20个字符以内，支持中英文数字及下划线</div>
        </div>

        <div className={Styles.buttonWrapper}>
          <ButtonCom text='保存提交' type='primary' loading={submitting} width={320} height={48} block={true} background={appInfo?.theme?.baseColor} color='#fff' onPress={submit} />
        </div>
      </div>
    </>
  );
}

export default EditNickname;
