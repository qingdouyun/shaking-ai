/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import api from '@/services/api';
import styles from "./goods.module.less";
import "./goods.module.less";
import Cookies from 'js-cookie';
import BaseUtils from '@/utils/BaseUtils';
import { useParams } from '@umijs/max';
import { Button, Carousel, Col, Collapse, Divider, InputNumber, message, Row, Space, Tabs, Tag, Pagination, Image } from 'antd';
import { useLocation } from '@umijs/max';
import Swiper from '@/components/Swiper';
import { CaretRightOutlined, CheckCircleOutlined, ShoppingOutlined } from '@ant-design/icons';

const DetailPage = (props: any) => {
  const location = useLocation();
  const params = useParams();
  const dataKey = params.key;
  const [data, setData] = useState({
    key: '',
    name: '',
    fullName: '',
    price: '0.00',
    type: "reality",
    images: [],
    introduction: '',
    tags: [],
    deliveryMethods: [],//当前商品支持的配送方式
    shippingMethodList: [],//商家支持的所有的配送方式
    serves: [],
    specs: [{
      specificationName: '',
      specificationValues: [{
        valueName: '',
        valueKey: '',
        checked: ''
      }]
    }]
  });
  const [buyInfo, setBuyInfo] = useState({
    'quantity': 1,
    'email': ''
  });
  const [swiperItems, setSwiperItems] = useState([]);
  const token = Cookies.get('token');
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息

  const [shippingMethodVisible, setShippingMethodVisible] = useState(false);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('消息提示');
  const [specMap, setSpecMap] = useState({});
  const [checkedMap, setCheckedMap] = useState({});
  const [specCheckedAll, setSpecCheckedAll] = useState(false);
  const [resultKey, setResultKey] = useState('');
  const [specPrice, setSpecPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [checkedItem, setCheckedItem] = useState([]);
  const [specChecked, setSpecChecked] = useState(false);
  const [specUnder, setSpecUnder] = useState(false);
  const [tab, setTab] = useState([{
    name: '详情介绍',
    isActice: true,
    id: 1,
  }, {
    name: '商品评论',
    isActice: false,
    id: 2,
  }])
  //初始化
  useEffect(() => {
    if (BaseUtils.isEmpty(appInfo) || appInfo.expired < Date.now()) {
      api.app.getInfo({}).then((response: any) => {
        message.destroy();
        if (response.success) {
          response.data.expired = Date.now() + 30 * 60 * 1000;
          localStorage.setItem('appInfo', JSON.stringify(response.data));
          setAppInfo(response.data);
        } else {
          message.error(response.msg);
        }
      });
    }
  }, []);

  //点击规格
  const elementTap = (e) => {
    const { parent } = e;   //规格名称索引
    const { index } = e;   //被点击的规格值索引
    const productData = data;
    const { specs } = productData;
    // 作者onLoad的时候new Map进去的 checkedMap = new Map;
    specs[parent].specificationValues.forEach((v, i) => {
      if (i === index) {
        v.checked = true;
        checkedMap.set(parent, v.valueName);
      } else {
        v.checked = false;
      }
    });
    const thisCheckedItem = [];
    checkedMap.forEach(v => {
      thisCheckedItem.push(v);
    })
    const { skuSpecs } = productData;   //取出后端传来的所有sku值
    specMap.set(parent, skuSpecs.filter(v => v.specValueKey == e.specificationValue));
    const temp = [];
    specMap.forEach((v, i) => {
      temp.push(v);
    });
    productData.specs = specs;
    if (temp.length != specs.length) {
      setSpecCheckedAll(false);
    } else {
      const a = [];
      temp.forEach(v => {
        v.forEach(v => a.push(v.skuKey));
      });
      const thisResultKey = unique(a) != [] ? unique(a) : a[0];
      setResultKey(thisResultKey);
      setSpecCheckedAll(true);
      for (let index = 0; index < productData.skuSpecs.length; index++) {
        const element = productData.skuSpecs[index];
        if (element.skuKey === thisResultKey) {
          if (element.isEnabled) {
            setSpecPrice(element.price);
            productData.price = element.price;
            setStock(element.instantStock);
            setSpecUnder(false);
          } else {
            setSpecUnder(true);
            message.error('该规格商品已下架');
            return;
          }
        }
      }
    };
    setData(productData);
    setSpecChecked(true);
    setCheckedItem(thisCheckedItem);
  }
  //取出相同数据
  const unique = (arr: any) => {
    const tempArr = []; //返回的值
    const indexArr = []; //返回的索引
    let key = "";
    for (let i = 0; i < arr.length; i++) {
      if (tempArr.indexOf(arr[i]) == -1) {
        tempArr.push(arr[i]);
        indexArr.push(i);
      } else if (tempArr.indexOf(arr[i]) >= 0) {
        for (let j = 0; j < tempArr.length; j++) {
          if (tempArr[j] == arr[i]) {
            key = tempArr[j]
            tempArr.splice(j, 1, tempArr[j]);
            indexArr.splice(j, 1, i);
          }
        }
      }
    }
    return key;
  }

  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.goods.detail({ key: dataKey }).then((res) => {
      if (res.success) {
        setCheckedMap(new Map());
        setSpecMap(new Map());
        setStock(res.data.instantStock);
        setSpecPrice(res.data.price);
        message.destroy();
        setData(res.data);
        const items: any[] = [];
        res.data.images.map((item: any, index: number) => {
          items.push({
            'key': `iv${index}`,
            'title': item.title,
            'filePath': item.path
          });
        });
        setSwiperItems(items);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  //配送、服务点击事件
  const onMenuClick = (key: string) => {
    if (key === 'shippingMethod') {
      setShippingMethodVisible(true);
      setPopupTitle('配送方式');
    } else if (key === 'servers') {
      setServiceVisible(true);
      setPopupTitle('服务');
    } else if (key === 'buy') {
      setBuyVisible(true);
      setPopupTitle('商品购买');
    }
  }

  //监听数量
  const onQuantityChange = (value: number) => {
    const tmpInfo = { ...buyInfo };
    tmpInfo.quantity = value;
    setBuyInfo(tmpInfo);
  }

  //确认购买
  const confirmBuy = () => {
    // console.log(props);
    if (BaseUtils.isEmpty(token)) {
      history.push({
        pathname: '/login?redirect=' + location.pathname,
      });
      return;
    }
    if (data.isSpecs != false) {
      if (!specCheckedAll) {
        message.info("请完成规格选择");
        return;
      }
    }
    if (specUnder) {
      message.info("当前规格已下架");
      return;
    }
    if (stock <= 0 || buyInfo.quantity > stock) {
      message.info("当前库存不足");
      return;
    }
    if (buyInfo.quantity === 0) {
      message.error("购买数量必须大于0");
      return;
    }
    history.push('/goods/checkout', { 'goods': data, ...buyInfo, 'skuKey': resultKey });
  }
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const tabChange = (key: string) => {
    if (key === "2") {
      api.goods.comments({
        pageNumber: 1,
        goodsKey: data.key,
      }).then((res) => {
        if (res.success) {
          setTotal(res.totalCount)
          if (res.data.length === 0) {
            message.info('暂无更多评论');
          } else {
            setComments(res.data);
          }
        } else {
          message.info(res.msg);
        }
      });
    }
  }
  const pageChange = (e) => {
    api.goods.comments({
      pageNumber: e,
      goodsKey: data.key,
    }).then((res) => {
      if (res.success) {
        setComments(res.data);
      } else {
        message.info(res.msg);
      }
    });
  }

  return (
    <>
      <div className={styles.goods}>
        <Row style={{ padding: '10px',border:'1px solid #f0f0f0',borderRadius:'10px' }}>
          <Col span={10} style={{ borderRadius:'10px' }}>
            <Swiper dataSource={{
              componentId: 'Swiper',
              componentName: '轮播广告',
              bgColor: '#ffffff',
              borderRadius: 10,//边角：直角或圆角
              margin: '0,0',//外边距
              padding: '0,0,0,0',//内边距
              template: 'slider',// carousel
              templateName: '滚动播放',// carousel为旋转木马
              indicator: 'dot',//dot：圆点 square：方形 line：线型 circle：圆圈数字 capsule：胶囊数字 
              carouselImageSpace: 0,//图片间距，用于旋转木马模式
              defaultImage: 'http://public.jinzhun.net/decorate/swiper-placeholder1.png',
              imageRadius: 0,//图片边角
              items: [...swiperItems]
            }} />
          </Col>
          <Col span={14} className={styles.right}>
            <p className={styles.title}>{data.fullName}</p>
            <div className={styles.tags}>
              <Space>
                {data.tags.map((item: any, index: number) => {
                  return <Tag key={`key${index}`} color={item.bgColor} style={{ color: item.color }}>{item.name}</Tag>;
                })}
              </Space>
            </div>
            <div className={styles.priceWrapper}>
              <div style={{ display: 'flex', color: appInfo?.theme?.baseColor }}>
                <p style={{ marginTop: 'auto', fontSize: '13px' }}>销售价&nbsp;</p>
                <em style={{ fontSize: '13px', marginTop: 'auto' }}>￥</em>
                <p style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '26px' }}>{data.price.toString().split('.')[0]}</p>
                <em style={{ fontSize: '13px', marginTop: 'auto', fontWeight: 'bold' }}>.{data.price.toString().split('.')[1]}</em>
              </div>
              <p style={{ textAlign: 'right', fontSize: '12px', color: 'gray', marginTop: 'auto' }}>已售 {data.sales}&nbsp;{data.unit}</p>
            </div>

            <div className={styles.services}>
              <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ color: 'gray' }} />}>
                <Collapse.Panel
                  key="shipping"
                  style={{ background: 'white' }}
                  header={
                    <div style={{ display: 'flex', color: 'gray', fontSize: '13px' }}>
                      配送：
                      <Space style={{ alignItems: 'center' }}>
                        {data.deliveryMethods.map((item: any, index: number) => {
                          return <div key={index} style={{ display: 'flex', alignItems: 'center' }}><CheckCircleOutlined style={{ fontSize: '13px' }} /><p>&nbsp;{item.name}</p></div>;
                        })}
                      </Space>
                    </div>
                  }>
                  {data.deliveryMethods.map((item: any) => {
                    return <>
                      <div key={item.key} className={styles.methoditem}>
                        <img src={item.icon} />
                        <p style={{ fontSize: '13px' }}>{item.name}</p>
                      </div>
                      <div className={styles.methoditemdesc}>
                        <p style={{ fontSize: '13px' }}>{item.remark}</p>
                      </div>
                    </>
                  })}
                </Collapse.Panel>
                <Collapse.Panel
                  key="services"
                  style={{ background: 'white' }}
                  header={
                    <div style={{ display: 'flex', color: 'gray', fontSize: '13px' }}>
                      服务：
                      <Space style={{ alignItems: 'center' }}>
                        {data.serves.map((item: any, index: number) => {
                          return <div key={index} style={{ display: 'flex', alignItems: 'center' }}><CheckCircleOutlined style={{ fontSize: '13px' }} /><p>&nbsp;{item.serveName}</p></div>;
                        })}
                      </Space>
                    </div>
                  }>
                  {data.serves.map((item: any, index: number) => {
                    return <>
                      <div key={index} className={styles.methoditem}>
                        <div className='icon'><CheckCircleOutlined style={{ fontSize: '14px', color: appInfo?.theme?.baseColor, marginRight: '10px' }} /></div>
                        <p style={{ fontSize: '13px' }}>{item.serveName}</p>
                      </div>
                      <div className={styles.methoditemdesc} style={{ marginLeft: '15px' }}>
                        <p style={{ fontSize: '13px' }}>{item.values.map((value: any) => { return `${value},` })}</p>
                      </div>
                    </>
                  })}
                </Collapse.Panel>
              </Collapse>
            </div>

            <div>
              <div className={styles.specs}>
                {data.specs.map((item: any, index: number) => {
                  return <div key={`kspec${index}`} style={{ display: 'flex' }}>
                    <div style={{ fontSize: '14px', margin: '10px 0', color: 'gray' }}>{item.specificationName}：</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {item.specificationValues.map((v, i) => {
                        return <>
                          <div style={{
                            borderRadius: '2px', padding: '0 10px', background: v.checked ? 'rgba(249,208,208,1)' : 'rgb(228 228 228)', display: 'block', margin: 'auto',
                            height: '30px', lineHeight: '30px', fontWeight: '300', marginRight: '10px',
                            border: v.checked ? '1px solid red' : '', color: v.checked ? 'red' : ''
                          }}
                            onClick={() => {
                              elementTap({
                                parent: index,
                                specificationValue: v.valueKey,
                                specificationKey: item.specificationKey,
                                index: i
                              })
                            }}
                          >{v.valueName}</div>
                        </>
                      })}
                    </div>
                  </div>
                })}
              </div>
            </div>

            <div className={styles.quantity}>
              <span>购买量：</span>
              <InputNumber min={1} max={1000} defaultValue={1} onChange={onQuantityChange} />
              <span style={{fontSize:'12px',marginLeft:'20px'}}>库存：{stock} 件</span>
            </div>

            <Button className={styles.buybtn} style={{ background: appInfo?.theme?.baseColor }} onClick={() => { confirmBuy() }} icon={<ShoppingOutlined />}>立即购买</Button>
          </Col>
        </Row>
        {/* <div style={{ background: '#f0f0f0', width: '100%', height: '8px', marginTop: '10px' }} /> */}
        <Tabs
          defaultActiveKey="1"
          onChange={tabChange}
          centered
          style={{
            marginTop: '15px',
            border:'1px solid #f0f0f0',
            borderRadius:'10px'
          }}
          items={[
            {
              label: `详情介绍`,
              key: '1',
              forceRender: true,
              children: <>
                <div dangerouslySetInnerHTML={{ __html: data.introduction }} />
              </>,
            },
            {
              label: `商品评论`,
              key: '2',
              children: <>
                {
                  comments.map((v) => {
                    return <>
                      <div className={styles.item}>
                        <div className={styles.info}>
                          <div className={styles.iUser}>
                            <Image
                              width={50}
                              src={v.avatar}
                            />
                            <div>{v.nickName}</div>
                          </div>
                          <div style={{ fontSize: '14px' }}>{v.createDate}</div>
                        </div>
                        <div className={styles.comment}>
                          <div style={{ fontSize: '14px' }}>{v.content}</div>
                          <div className={styles.imgContainer}>
                            {v.images.length <= 2 ? v.images.map((j) => {
                              return <><Image width={80} className={styles.iCTemplate1} src={j.path}
                              /></>
                            }) : v.images.map((k) => {
                              return <><Image width={80} className={styles.iCTemplate2} src={k.path}
                              /></>
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  })
                }
                <Pagination defaultCurrent={1} total={total} style={{ margin: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onChange={pageChange} />
              </>,
            },
          ]}
        />
      </div>
    </>
  );
};

export default DetailPage;
