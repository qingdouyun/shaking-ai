import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { message } from 'antd';
import { useParams } from '@umijs/max';

const ArticlePage = (props: any) => {
  const params  = useParams();
  const dataKey = params.key;
  const [data, setData] = useState({
    title: '',
    createDate: '',
    description: '',
  });

  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.article.detail({ key: dataKey }).then((res) => {
      message.destroy();
      if (res.success) {
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);
  return (
    <>
      <div style={{width:'100%', background: '#fff',minHeight:'800px'}}>
        <p
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '10px',
            margin: '0',
          }}
        >
          {data.title}
        </p>
        <p
          style={{
            color: '#727272',
            fontSize: '14px',
            padding: '0 10px',
            margin: 0,
            marginBottom:'15px'
          }}
        >
          {data.createDate}
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: data.description }}
          style={{ padding: '20px',borderTop:'1px solid #f0f0f0'}}
        />
      </div>
    </>
  );
};

export default ArticlePage;
