import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import {ButtonCom} from "@/components";
import Styles from "./index.module.less";
import Assets from '@/assets/images';
import { message, Modal } from 'antd';
import { history } from '@umijs/max';

const ReceiverPage = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));

  // 初始化方法
  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.user.address().then((res) => {
      message.destroy();
      if (res.success) {
        setAddress(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  const handleDelete = (index: number) => {
    setVisible(true);
    setActiveIndex(index)
  }

  //删除
  const del = () => {
    setVisible(false)
    api.user.delete_address({ key: address[activeIndex].key }).then((res) => {
      message.error(res.msg);
      if (res.success) {
        const _address = [...address];
        _address.splice(activeIndex, 1);
        setAddress(_address);
      }
    });
  };

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>收货地址</p></div>
      <div className={Styles.addressList} style={{background:appInfo.theme.bgColor}}>
        {address.map((item: any, index: number) => (
            <div key={index} className={Styles.item}>
              <div className={Styles.header}>
                <div className={Styles.name} style={{fontSize:'15px'}}>{item.consignee}</div>
                <div className={Styles.phone} style={{fontSize:'15px'}}>{item.phone}</div>
              </div>
              <div className={Styles.area} style={{fontSize:'13px'}}>{item.areaName}</div>
              <div className={Styles.areaDetail} style={{fontSize:'13px'}}>{item.address}</div>
              <div className={Styles.option}>
                <img className={Styles.icon} src={item.isDefault ? Assets.select : Assets.noSelect} style={{width:'18px',height:'18px'}}/>
                <div className={Styles.default} style={{fontSize:'13px'}}>默认</div>
                <div className={Styles.itemButton} onClick={() => handleDelete(index)}>
                  <div className={Styles.text} style={{fontSize:'13px'}}>删除</div>
                </div>
                <div className={Styles.itemButton} onClick={() => {history.push('/user/receiver/edit',{'detail':item})}}>
                  <div className={Styles.text} style={{fontSize:'13px'}}>编辑</div>
                </div>
              </div>
            </div>
          ))}
        <div className={Styles.addItem} onClick={() => {history.push('/user/receiver/add')}}>
          <img src={Assets.addAddress} className={Styles.addIcon} alt="" style={{width:'30px',height:'30px'}}/>
          <div className={Styles.addText} style={{fontSize:'14px'}}>添加收货地址</div>
        </div>
      </div>
      <Modal title="消息提示" style={{top:'35%'}} open={visible} okText="确定" cancelText="取消" onOk={del} onCancel={() => setVisible(false)}>
        <p>确认删除当前所选地址？</p>
      </Modal>
    </>
  );
};


export default ReceiverPage;
