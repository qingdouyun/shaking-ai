import { SoundOutlined, UserOutlined } from '@ant-design/icons';
import React, { Component, useEffect, useState } from 'react';
import { history } from 'umi';
import Cookies from 'js-cookie';
import BaseUtils from '@/utils/BaseUtils';
import api from '@/services/api';
import { message } from 'antd';

const Header = (props: any) => {
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息

  // const marginArray = dataSource.header.margin.split(",");
  // const paddingArray = dataSource.header.padding.split(",");
  // let marginStr = '';
  // let paddingStr = '';
  // marginArray.map((item: any) => {
  //   marginStr += ' ' + item + 'px';
  // });
  // paddingArray.map((item: any) => {
  //   paddingStr += ' ' + item + 'px';
  // });

  useEffect(() => {
    if (BaseUtils.isEmpty(appInfo) || appInfo.expired < Date.now() ) {
      api.app.getInfo({}).then((response: any) => {
        if (response.success) {
          response.data.expired = Date.now() + 30*60*1000;
          localStorage.setItem('appInfo',JSON.stringify(response.data));
          setAppInfo(response.data);
        } else {
          message.error(response.msg);
        }
      });
    }
    //合从客服
    // (function(d, w, c) {
    //   if (w[c]) return;
    //   var s = d.createElement("script");
    //   w[c] = function() {
    //     (w[c].z = w[c].z || []).push(arguments);
    //   };
    //   s.async = true;
    //   s.src = "https://static.ahc.ink/hecong.js";
    //   if (d.head) d.head.appendChild(s);
    // })(document, window, "_AIHECONG");
    // _AIHECONG("ini",{ channelId : "Ga27pI" });

  }, []);

  //登录
  const onLogin = () => {
    const token = Cookies.get('token');
    if (BaseUtils.isEmpty(token)) {
      history.push({pathname: '/login'});
      return;
    }
    history.push({pathname: '/user/index'});
  }

  //监听跳转
  const onLinkChange = (record: any) => {
    BaseUtils.pageJump(record);
  }

  return (
    <div className='wyy-section-header'>
      <div className='header-wrapper' style={{lineHeight:'84px',borderBottom:'1px solid #d5d5d5'}}>
          <header className='page-width' style={{maxWidth:'1100px',justifyContent:'space-between'}}>
            <div className='logo-wrapper'>
              <img src={appInfo?.header.logo} width={100} onClick={()=>{history.push('/')}}/>
              <ul style={{fontSize:'16px',marginLeft:'26px'}}>
                {appInfo?.header.navigations.map((item: any) => {
                    return <li key={item.key} onClick={()=>{onLinkChange(item)}}><a>{item.title}</a></li>;
                })}
              </ul>
            </div>
            <div className='uc-wrapper'>
              <a style={{fontSize:'24px',marginRight:'10px'}} onClick={()=>{onLogin()}}><UserOutlined /></a>
              <a style={{fontSize:'24px',paddingRight:'0'}} onClick={()=>{history.push('/notice/list')}}><SoundOutlined /></a>
            </div>
          </header>
      </div>
    </div>
  );
}


export default Header;
