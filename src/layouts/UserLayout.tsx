import {history,Outlet} from "umi";
import React, { useEffect, useState } from 'react';
import { Image, message } from 'antd';
import '@/styles/user.less';
import Cookies from 'js-cookie';
import BaseUtils from '@/utils/BaseUtils';
import { KeyOutlined, PayCircleOutlined, PhoneFilled, PushpinOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation } from "@umijs/max";
import api from "@/services/api";

const UserBasicLayout = (props: any) => {
  const location  = useLocation();
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));
  
  const token = Cookies.get('token');

  useEffect(() => {
    api.user.get_info({}).then((response: any) => {
      if (response.success) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        setUserInfo(response.data);
      }
      message.destroy();
    });
    const currentWindow = JSON.parse(localStorage.getItem("currentWindow") || '{"title":"标题","subtitle":"子标题"}');//窗口
    currentWindow.title = '个人中心';
    currentWindow.subtitle = '';
    localStorage.setItem('currentWindow',JSON.stringify({...currentWindow}));
  }, []);

  return (
    <div style={{background:appInfo?.theme?.bgColor,borderRadius:'15px',padding:'20px'}}>
      <div className='my-header'>
        <div className='my-avatar'>
          <Image
              src={BaseUtils.isEmpty(token)?'https://cdn.pro.shakingcloud.com/wyy/decorate/whale.png':userInfo?.avatar}
              width={64}
              height={64}
              style={{ borderRadius: 32,}}
          />
          <p style={{fontSize:'16px',padding:'15px',fontWeight:'600',margin:0}}>{BaseUtils.isEmpty(token)?<a style={{color:'white'}} onClick={()=>{history.push('/login');}}>请登录</a>:userInfo?.nickname}</p>
        </div>
        <div className='my-info'>
          <ul style={{fontSize:'13px'}}>
            <li onClick={()=>{history.push('/user/wallet')}}>
              <em>￥{userInfo?.balance}</em>
              <p>余额</p>
            </li>
            <li onClick={()=>{history.push('/user/points')}}>
              <em>{userInfo?.points}</em>
              <p>积分</p>
            </li>
            <li onClick={()=>{history.push('/user/card/list')}}>
              <em>{userInfo?.cards}</em>
              <p>权益卡</p>
            </li>
            <li style={{border:0}}>
              <em>{userInfo?.coupons}</em>
              <p>优惠券</p>
            </li>
          </ul>
        </div>
      </div>
      <div style={{width:'100%',height:'10px'}}/>
      <div className='my-content'>
        <div className='my-menus'>
          <div className='menu-item'>
            <p className='menu-item-title' style={{fontSize:'13px',borderRadius:'10px 10px 0 0'}}>账号设置</p>
            <ul style={{fontSize:'14px'}}>
              <li onClick={()=>{history.push('/user/profile')}} style={{color:location.pathname==='/user/profile'?appInfo?.theme?.baseColor:'black'}}>
                <UserOutlined /><p>个人资料</p>
              </li>
              <li onClick={()=>{history.push('/user/account/password')}} style={{color:location.pathname==='/user/account/password'?appInfo?.theme?.baseColor:'black'}}>
                <KeyOutlined /><p>修改密码</p>
              </li>
              <li onClick={()=>{history.push('/user/account/phone')}} style={{color:location.pathname==='/user/account/phone'?appInfo?.theme?.baseColor:'black'}}>
                <PhoneFilled /><p>更换手机</p>
              </li>
              <li onClick={()=>{history.push('/user/share')}} style={{color:location.pathname==='/user/share'?appInfo?.theme?.baseColor:'black'}}>
                <ShareAltOutlined /><p>分享邀请</p>
              </li>
            </ul>
          </div>
          <div className='menu-item'>
            <p className='menu-item-title' style={{fontSize:'13px'}}>交易信息</p>
            <ul style={{fontSize:'14px'}}>
              <li onClick={()=>{history.push('/user/order/list')}} style={{color:location.pathname==='/user/order/list'?appInfo?.theme?.baseColor:'black'}}>
                <PayCircleOutlined /><p>我的订单</p>
              </li>
              <li onClick={()=>{history.push('/user/receiver/list')}} style={{color:location.pathname==='/user/receiver/list'?appInfo?.theme?.baseColor:'black'}}>
                <PushpinOutlined /><p>收货地址</p>
              </li>
            </ul>
          </div>
        </div>
        <div style={{width:'10px',height:'100%'}}/>
        <div className='my-menu-content'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserBasicLayout;