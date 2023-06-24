/* eslint-disable array-callback-return */
import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import api from '@/services/api';
import Styles from './index.module.less';
import { Divider, Empty, message, Pagination } from 'antd';
import { history } from '@umijs/max';


const AppPage = () => {
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息
  const [data, setData] = useState([]);
  const [tabs, setTabs] = useState([
    { name: '全部', value: '', isActive: true },
    { name: '待付款', value: 'unpaid', isActive: false },
    { name: '待发货', value: 'unshipped', isActive: false },
    { name: '待收货', value: 'shipped', isActive: false },
    { name: '已完成', value: 'completed', isActive: false },
  ]);
  const [activeTab, setActiveTab] = useState({
    'name':'',
    'value':'',
    'isActive':false
  });
  const [paginationProps, setPaginationProps] = useState({
    showSizeChanger: true,
    showQuickJumper: false,
    pageSize: 5,
    total: 1,
    current: 1
  });


  const getTableList = () => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    const result = api.order.getMyOrders({
      'pageNumber': paginationProps.current,
      'pageSize': paginationProps.pageSize,
      'status': activeTab.value,
    });
    result.then((res) => {
      message.destroy();
      if (res.success) {
        const pageProps = { ...paginationProps };
        pageProps.total = res.totalCount;
        setPaginationProps(pageProps);
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    });
    return result;
  };

  useEffect(()=>{
    getTableList();
  },[paginationProps.current,activeTab.value]);

  //tab切换
  const tapTab = (e: any) => {
    setData([]);
    const tmpTabs = [...tabs];
    tmpTabs.map((item, i) => {
      if (i === e) {
        item.isActive = true;
        setActiveTab(item);
      } else {
        item.isActive = false;
      }
    });
    setTabs(tmpTabs);
    const pageProps = { ...paginationProps };
    pageProps.current = 1;
    setPaginationProps(pageProps);
  };

  //监听翻页
  const onPageChange = (pageNumber,pageSize) => {
    const pageProps = { ...paginationProps };
    pageProps.current = pageNumber;
    setPaginationProps(pageProps);
  }

  return (
    <>
    <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>我的订单</p></div>
    <div className={Styles.container}>
      <div style={{background:appInfo.theme.bgColor,minHeight:'800px'}}>
        <div id='orderList'>
          <div className={Styles.tab}>
            {tabs.map((v, i) => (
              <span
                key={i}
                onClick={() => {
                  tapTab(i);
                }}
                style={{ color: v.isActive ? '#111111':'',fontSize:'13px' }}
              >
                {v.name}
                {v.isActive && <i style={{background:appInfo?.theme?.baseColor}} />}
              </span>
            ))}
          </div>
          <div className={Styles.order}>
            <div>
            {data?.length !== 0 ? (
              data.map((v: any, i) => (
                <div
                  key={i}
                  className={Styles.item}
                  onClick={() => {
                    history.push({ pathname: '/user/order/detail/' + v?.sn })
                  }}
                >
                  <div className={Styles.itemGroup} >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', marginRight: '10px' }}>
                        订单编号:
                      </span>
                      <div style={{ fontSize: '14px', color: '#727272' }}>
                        {v.sn}
                      </div>
                    </div>
                    <span className={Styles.status} style={{color:appInfo?.theme?.baseColor,fontSize:'14px'}}>
                      {v.statusName}
                    </span>
                  </div>
                  {v.items.map((p_v: any, p_i: number) => (
                    <div key={p_i} className={Styles.product}>
                      <img src={p_v.image}></img>
                      <div className={Styles.info}>
                        <div className={Styles.infoItem}>
                          <div className={Styles.title} style={{fontSize:'14px'}}>{p_v.name}</div>
                          <div className={Styles.num} style={{fontSize:'14px'}}>x{p_v.quantity}</div>
                        </div>
                        <div className={Styles.full} style={{fontSize:'12px'}}>{p_v.fullName}</div>
                        <div className={Styles.infoItem} style={{paddingTop: 12}}>
                          <div className={Styles.time} style={{fontSize:'14px'}}>{v.createDate}</div>
                          <div className={Styles.price} style={{fontSize:'14px'}}>¥&nbsp;{p_v.amount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/*<div className={Styles.detail}>*/}
                  {/*  /!*<span>合计：¥ {v.totalAmount}</span>*!/*/}
                  {/*  <span>*/}
                  {/*    <span>合计：</span>*/}
                  {/*    <span style={{ color: '#FF2D41' }}>¥ {v.amount}</span>*/}
                  {/*  </span>*/}
                  {/*  <span style={{ fontSize: '13px', color: '#727272' }}>*/}
                  {/*    共{v.totalQuantity}件*/}
                  {/*  </span>*/}
                  {/*</div>*/}
                </div>
              ))
            ) : (
              <div className={Styles.fill} style={{ marginTop: 50 }}>
                <Empty imageStyle={{ width: 128 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
            <div style={{textAlign:'right',padding:'10px 0'}}><Pagination {...paginationProps} onChange={onPageChange}/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AppPage;
