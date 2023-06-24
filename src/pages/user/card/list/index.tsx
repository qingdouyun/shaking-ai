import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import Styles from './index.module.less';
import { Empty, message } from 'antd';
import { history } from '@umijs/max';

const AppPage = (props: any) => {
  const [list, setList] = useState([]);

  // 初始化方法
  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.user.cards().then((res) => {
      message.destroy();
      if (res.success) {
        setList(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);
  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>我的权益卡</p></div>
      <div className={Styles.cardList}>
        {list.length !== 0 ? (
          list.map((v: any, i: number) => (
            <img
              key={i}
              onClick={() => {
                history.push({ pathname: '/user/card/detail/'+v.key });
              }}
              src={v.background}
            />
          ))
        ) : (
          <div className={Styles.fill} style={{ marginTop: 120 }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    </>
  );
};

export default AppPage;
