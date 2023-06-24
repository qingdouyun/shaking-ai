import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { time, transTimestamp } from '@/utils/PublicMethod';
import Styles from './index.nodule.less';
import cx from 'classnames';
import { Empty, message, Pagination } from 'antd';
import Assets from '@/assets/images/wallet';

const AppPage = (props: any) => {
  const [list, setList] = useState([]);
  //应用信息
  const [appInfo, setAppInfo] = useState(
    JSON.parse(localStorage.getItem('appInfo')),
  );
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
    const result = api.user.deposits({'pageNumber': paginationProps.current,'pageSize': paginationProps.pageSize,});
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

  useEffect(()=>{
    loadMore();
  },[paginationProps.current]);

  //监听翻页
  const onPageChange = (pageNumber,pageSize) => {
    const pageProps = { ...paginationProps };
    pageProps.current = pageNumber;
    setPaginationProps(pageProps);
  }

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><img src={Assets.wallet} style={{width:'20px',height:'20px',marginRight:'10px'}}/><p>余额明细</p></div>
      <div className={Styles.record}>
        {list.length !== 0 ? (
          list.map((v: any, i: number) => (
            <div className={Styles.item} key={i}>
              <div className={Styles.itemGroup}>
                <div className={Styles.title}>{v.title}</div>
                <div
                  className={cx({
                    [Styles.price]: true,
                    [Styles.add]: v.credit,
                  })}
                >
                  {v.credit && `+${v.credit}`}
                  {v.debit && `-${v.debit}`}
                </div>
              </div>
              <span className={Styles.time}>
                {transTimestamp(v.createDate)}
              </span>
            </div>
          ))
        ) : (
          <div className={Styles.fill} style={{ marginTop: '100px' }}>
            <Empty description="什么也没有哦 ~" />
          </div>
        )}
        <div style={{textAlign:'right',padding:'10px 0'}}><Pagination {...paginationProps} onChange={onPageChange}/></div>
      </div>
    </>
  );
};

export default AppPage;
