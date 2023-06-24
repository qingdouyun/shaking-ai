import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import Styles from './index.module.less'
import { useParams } from '@umijs/max';
import { message } from 'antd';

const DetailPage = (props: any) => {
  const params  = useParams();
  const dataKey = params.key;
  const [notice, setNotice] = useState({
    title: '',
    createDate: '',
    description: '',
  });

  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.notice.detail({ key: dataKey }).then((res) => {
      if (res.success) {
        message.destroy();
        setNotice(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  return (
    <>
      <div className={Styles.notice}>
        <p className={Styles.title}>
          {notice.title}
        </p>
        <p
          className={Styles.time}
          style={{
            color: '#727272',
            fontSize: '14px',
            margin: 0,
          }}
        >
          发表时间：{notice.createDate}
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: notice.description }}
          style={{ padding: '20px' }}
        />
      </div>
    </>
  );
};

export default DetailPage;
