import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import api from '@/services/api';
import QRCode from "qrcode";
import { drawAndShareImage, is_weixin } from '@/utils/PublicMethod';
import { Empty, Image, message, Modal, Pagination } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import BaseUtils from '@/utils/BaseUtils';


const WebPage = (props: any) => {
  // console.log(window.location.origin);
  const [base64Data, setbase64Data] = useState('');
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState([]);
  
  const [paginationProps, setPaginationProps] = useState({
    showSizeChanger: true,
    showQuickJumper: false,
    pageSize: 10,
    total: 1,
    current: 1
  });

  const loadMore = () => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    const result = api.user.invite.records({'pageNumber': paginationProps.current,'pageSize': paginationProps.pageSize});
    result.then((res) => {
      message.destroy();
      if (res.success) {
        const pageProps = { ...paginationProps };
        pageProps.total = res.totalCount;
        setPaginationProps(pageProps);
        setList(res.data);
      } else {
        message.error(res.msg);
      }
    });
    return result;
  };

  // 生成合并图片
  const init = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}') ?? {};
    const qrcodeUrl = `${window.location.origin}/register?incode=${userInfo?.invitationCode}`;
    const res = await api.user.invite.list({});
    if (res.success) {
      message.destroy();
      // 将qrcodeUrl 链接转化为二维码图片
      const qrcodeUrlBase64 = await QRCode.toDataURL(qrcodeUrl);

      // 合成邀请图片
      const compositePicture = await drawAndShareImage(
        res?.data[0]?.image ?? '',
        qrcodeUrlBase64,
      );

      setbase64Data(compositePicture);
    }

    message.destroy();
  };
  
  useEffect(()=>{
    BaseUtils.isLogin();
    init();
    loadMore();
  },[paginationProps.current]);

  //监听翻页
  const onPageChange = (pageNumber,pageSize) => {
    const pageProps = { ...paginationProps };
    pageProps.current = pageNumber;
    setPaginationProps(pageProps);
  }

  return (
    <div style={{position:'relative'}}>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px',justifyContent:'space-between'}}>
        <p>我的分享邀请</p>
        <div className={styles.sharebtn} onClick={()=>{setVisible(true)}}>
          <ShareAltOutlined style={{fontSize:'20px',color: appInfo?.theme?.baseColor}}/>
          <span style={{color: appInfo?.theme?.baseColor,marginLeft:'8px'}}>分享</span>
        </div>
        <Modal
          open={visible}
          closable={true}
          bodyStyle={{padding:0}}
          onCancel={()=>{setVisible(false)}}
          footer={false}
        >
          <div style={{padding:'40px'}}><img className={styles.img} src={base64Data}/></div>
        </Modal>
      </div>
      <div className={styles.main}>
        {list.length !== 0 ? (
          list.map((item: any, index: number) => (
            <div key={item.key} className={styles.item}>
              <Image
                src={item.avatar}
                width={50}
                height={50}
                style={{ borderRadius: 25 }}
              />
              <div className={styles.info}>
                <span className={styles.title}>{item.nickname}</span>
                <p className={styles.desc}>{item.createDate}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.fill} style={{ marginTop: '100px' }}>
            <Empty description="什么也没有哦 ~" />
          </div>
        )}
        <div style={{textAlign:'right',padding:'10px 0'}}><Pagination {...paginationProps} onChange={onPageChange}/></div>
      </div>
      
    </div>
  );
};

export default WebPage;
