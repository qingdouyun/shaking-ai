import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import Styles from './index.module.less';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider, Empty, message } from 'antd';
import { history } from '@umijs/max';
import { SoundOutlined } from '@ant-design/icons';

// 官方公告
const NoticeList = (props: any) =>{
  const [noticeState, setNoticeState] = useState({
    total: 1,
    moreLoading: true,
    data: [],
  });

  // 加载更多-- 官方公告
  const loadMoreNotice = async () => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    const res = await api.notice.list({
      pageNumber: noticeState.total,
      pageSize: 10,
    });
    if (res.success && res.data !== null) {
      setNoticeState((state: any) => {
        state = {
          data: [...state.data, ...res.data],
          total: state.total + 1,
          moreLoading: noticeState.data.length < res.totalCount,
        };
        return { ...state };
      });
      message.destroy();
      return;
    }else{
      message.error(res.msg);
      setNoticeState((state: any) => {
        state = {
          moreLoading: false,
        };
        return { ...state };
      });
    }
  };

  useEffect(()=>{
    loadMoreNotice();
  },[]);

  return (
    <>
      <div style={{width:'100%'}}>
      <InfiniteScroll 
          style={{ fontSize: '12px'}}
          next={loadMoreNotice}
          hasMore={noticeState.moreLoading}
          loader={<p style={{display:'flex',lineHeight:'45px',justifyContent:'center',color:'gray'}} >加载中 . . .</p>} 
          dataLength={noticeState.data.length}
          endMessage={<Divider plain><span style={{color:'gray'}}>已经到底了 🤐</span></Divider>}
          scrollableTarget="scrollableDiv"//注意：这个 scrollableDiv 是需要监听滚动的div的id，必填项
      >
        {noticeState.data?.length ? (
          noticeState.data.map((v: any, i: number) => (
            <div
              className={Styles.notice}
              key={i}
              onClick={() =>
                history.push({ pathname: '/notice/detail/' + v.key })
              }
            >
              <div className={Styles.list}>
                <SoundOutlined />
                <span>{v.title}</span>
              </div>
              <div className={Styles.time}>发表时间：{v.createDate}</div>
            </div>
          ))
        ) : (
          <Empty />
        )}
        </InfiniteScroll>
        </div>
    </>
  );
}

export default NoticeList;
