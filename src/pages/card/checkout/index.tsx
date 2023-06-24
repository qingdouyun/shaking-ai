import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import IconFont from '@/components/IconFont';
import api from '@/services/api';
import BaseUtils from '@/utils/BaseUtils';
import Cookies from 'js-cookie';
import styles from './index.module.less';
import { ButtonCom } from "@/components";
import QRCode from "qrcode.react";
import { Input, message, Modal, Radio, Space } from 'antd';
import { EnvironmentOutlined, RightOutlined, WarningOutlined } from '@ant-design/icons';
import { useLocation } from '@umijs/max';
import Marquee from 'react-fast-marquee';

let requestStatusEnable = true;

const AppPage = (props: any) => {
  const location = useLocation();
  const { card } = location.state;
  const token = Cookies.get('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息

  const [selectedMethod, setSelectedMethod] = useState<string>('alipayQrcode');
  const [submiting, setSubmiting] = useState(false);
  const [discountText, setDiscountText] = useState('无折扣');
  const [totalPrice, setTotalPrice] = useState(parseFloat(card.price * 1).toFixed(2));
  // const [orderSn, setOrderSn] = useState('');
  const [payMethodName, setPayMethodName] = useState('支付宝');
  const [agreement, setAgreement] = useState(false);
  const [email, setEmail] = useState(userInfo?.email);//邮箱信息
  const [address, setAddress] = useState({
    address: "",
    areaName: "",
    consignee: "",
    phone: "",
    key: ''
  });

  //二维码
  const [visible, setVisible] = useState(false);
  const [qrcodeUrl, setQrcodeUrl] = useState('');

  useEffect(() => {
    if (location.state.address === undefined) {
      api.user.get_default_receiver().then((res) => {
        if (res.success) {
          if (res.data !== null) {
            setAddress(res.data);
          }
        } else {
          message.error({ content: res.msg });
        }
      })
    } else {
      setAddress(location.state.address);
    }
  }, []);

  /**
   * 将对象转换为url参数形式
   */
  const urlEncode = (data: any) => {
    const _result = [];
    // eslint-disable-next-line guard-for-in
    for (let key in data) {
      let value = data[key];
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + '=' + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  };

  //获取订单支付状态
  const getPaymentStatus = (psn: string) => {
    // message.loading({
    //   content: '支付校验',
    //   duration: 0,
    // });
    api.order.getPaymentStatus({ 'paymentSn': psn }).then((response: any) => {
      message.destroy();
      if (response.success) {
        message.success({
          content: response.msg,
        });
        setQrcodeUrl('');
        setVisible(false);
        history.push('/user/profile');
      } else {
        setTimeout(() => {
          if (requestStatusEnable) {
            getPaymentStatus(psn);
          }
        }, 1000);
      }
    });
  };

  //支付失败
  const paymentFailed = () => {
    message.error({
      content: '请联系客服处理或重新支付',
    });
  };

  //收款二维码弹框
  const showQrcode = (codeUrl: string) => {
    setQrcodeUrl(codeUrl);
    setVisible(true);
  }

  const submit = async () => {
    if (BaseUtils.isEmpty(token)) {
      history.push({
        pathname: '/login?=redirect' + location.pathname,
      });
      return;
    }
    if (BaseUtils.isEmpty(userInfo)) {
      history.push({
        pathname: '/login?=redirect' + location.pathname,
      });
      return;
    }
    // if (goods.type === 'virtual' && !BaseUtils.isEmail(email)) {
    //   message.error("请输入正确的邮箱地址");
    //   return;
    // }
    if (selectedMethod === '') {
      message.error('请选择您的付款方式')
      return
    }
    //缓存下填过的email地址
    if (BaseUtils.isEmpty(userInfo.email)) {
      const tmpInfo = { ...userInfo };
      tmpInfo.email = email;
      localStorage.setItem('userInfo', JSON.stringify(tmpInfo));
      // console.log(tmpInfo);
    }

    setSubmiting(true);
    message.loading({
      content: '正在拉取支付',
      duration: 0,
    });
    // setOrderSn(res.data.orderSn);
    api.order.createPaymentCard({
      'cardKey': card.key,
      paymentMethod: selectedMethod,
      subPayMethod: '', //子支付
      payMethod: 'fullPayment',
      bankParam: '1',
    }).then(async (response: any) => {
      setSubmiting(false);
      message.destroy();
      if (response.success) {
        // console.log(response);
        if (selectedMethod === 'wxPayNative') {
          if (response.data.code === "NO_AUTH") {
            message.error({ content: response.data.message });
            return;
          } else {
            showQrcode(response.data.code_url);
            setTimeout(() => {
              requestStatusEnable = true;
              getPaymentStatus(response.data.paymentSn);
            }, 2000);//延迟2秒钟再执行
          }
        } else if (selectedMethod === 'alipayQrcode') {
          showQrcode(response.data.code_url);
          setTimeout(() => {
            requestStatusEnable = true;
            getPaymentStatus(response.data.paymentSn);
          }, 2000);//延迟2秒钟再执行
        } else if (selectedMethod === 'alipayH5') {
          // console.log(response);
          history.push('/card/checkout/pay', { 'form': response.data.formData });
        }
      } else {
        setSubmiting(false);
        message.error({
          content: response.msg,
        });
      }
    });
  };

  //支付方式选择
  const onPaymentMethodChange = (method: string) => {
    setSelectedMethod(method);
    if (method === 'wxPayNative') {
      setPayMethodName('微信');
    } else if (method === 'alipayQrcode') {
      setPayMethodName('支付宝');
    }
  };

  //配送方式
  const [shippingMethodVisible, setShippingMethodVisible] = useState(false);
  const onDeliveryMethodChange = () => {

  }
  //监听邮箱地址
  const onEmailChange = (value: string) => {
    setEmail(value);
  }

  return (
    <div style={{background:appInfo?.theme?.bgColor,padding:'15px',borderRadius:'15px'}}>
      <div className={styles.pageTitle}>订单结算</div>
      <div className={styles.pay}>
        {/* <div className={styles.consigneeinfo}>
          <div className={styles.infoitem} onClick={() => { goods.deliveryMethods.length > 1 ? setShippingMethodVisible(true) : setShippingMethodVisible(false) }}>
            <p>配送方式：</p>
            <div><em style={{ paddingRight: '6px', color: '#000' }}>自动发货</em>{goods.type === 'reality' ? <RightOutlined /> : ''}</div>
          </div>
          <div className={styles.infoitem} hidden={goods.type !== 'reality'} onClick={() => history.push('/goods/receiver/list', location.state)}>
            <div className={styles.left}>
              <p>收货地址：</p>
              <EnvironmentOutlined style={{ fontSize: '16px', marginRight: '5px' }} />
              <div style={{ lineHeight: '26px', display: 'flex' }}>
                <Space>
                  <p style={{ fontWeight: '600', color: '#000' }}>{address.areaName + address.address}</p>
                  <p>{address.consignee} {address.phone}</p>
                </Space>
              </div>
            </div>
            <RightOutlined style={{ marginLeft: '12px' }} />
          </div>
          <div className={styles.infoitem} hidden={goods.type === 'reality'}>
            <p>邮箱地址：</p>
            <Input placeholder='请输入您的邮箱号' style={{ width: '90%' }} clearable onChange={onEmailChange} defaultValue={email} />
          </div>
        </div>
        <div style={{ background: appInfo?.theme?.bgColor, width: '100%', height: '8px' }} /> */}
        
        <div className={styles.info}>
          <img src={card.background}></img>
          <div className={styles.content}>
            <div className={styles.name}>{card.name}</div>
            <div style={{ fontSize: '12px',color:'gray',width:'100%',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>
              {card.remark}
            </div>
            <div className={styles.price}>¥ {card.price}</div>
          </div>
          <div className={styles.num}>x{1}</div>
        </div>
        <div style={{ background: appInfo?.theme?.bgColor, width: '100%', height: '8px' }} />
        <div className={styles.paymentMethods}>
          <div className={styles.header}>
            <i style={{ width: '4px', height: '30%', background: appInfo?.theme?.baseColor }} />
            <div className={styles.title}>&nbsp;&nbsp;支付方式</div>
          </div>
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',cursor:'pointer' }} onClick={() => { onPaymentMethodChange('alipayQrcode'); }}>
                <div>
                  <img src="https://cdn.shakingcloud.com/nftea/product/zfb.png" width={40} />
                  <span style={{ fontSize: '15px' }}>
                    &nbsp;&nbsp;支付宝
                    <em
                      style={{
                        fontSize: '12px',
                        marginLeft: '5px',
                        color: 'gray',
                      }}
                    >
                      推荐
                    </em>
                  </span>
                </div>
                <Radio checked={selectedMethod === 'alipayQrcode'} value="alipayQrcode" />
              </div>
              <div
                onClick={() => { onPaymentMethodChange('wxPayNative'); }}
                style={{ display: 'flex', justifyContent: 'space-between',cursor:'pointer' }}
              >
                <div>
                  <img src="https://cdn.shakingcloud.com/nftea/product/WX.png" width={40} />
                  <span style={{ fontSize: '15px' }}>&nbsp;&nbsp;微信支付</span>
                </div>
                <Radio checked={selectedMethod === 'wxPayNative'} value="wxPayNative" />
              </div>
            </Space>
          </div>
        </div>
        <div style={{ background: appInfo?.theme?.bgColor, width: '100%', height: '8px' }} />
        {/* <div className={styles.choose}>
          <div className={styles.header}>
          <i style={{width:'4px',height:'30%',background:appInfo?.theme?.baseColor}}/>
            <div className={styles.title}>&nbsp;&nbsp;优惠说明</div>
          </div>

          <div className={styles.item}>
            <div>优惠折扣</div>
            <div>{discountText}</div>
          </div>
        </div> */}

        <div className={styles.heji}>
          <div className={styles.header}>
            <i style={{ width: '4px', height: '30%', background: appInfo?.theme?.baseColor }} />
            <div className={styles.title}>&nbsp;&nbsp;合计</div>
          </div>
          <div className={styles.totalitem}>
            <div>商品金额</div>
            <div className={styles.active}>¥{totalPrice}</div>
          </div>
          <div className={styles.totalitem}>
            <div>运费</div>
            <div className={styles.active}>¥0.00</div>
          </div>
          <div className={styles.totalitem}>
            <div>促销活动</div>
            <div>暂无可用</div>
          </div>
          <div className={styles.totalitem}>
            <div>优惠券/优惠码</div>
            <div>暂无可用</div>
          </div>
          <div className={styles.totalitem}>
            <div>积分</div>
            <div>暂无可用</div>
          </div>
          <div style={{ background: appInfo?.theme?.bgColor, width: '100%', height: '1px', marginTop: '5px' }} />
          <div className={styles.item}>
            <div style={{ color: appInfo?.theme?.baseColor, display: 'flex', marginLeft: 'auto', fontWeight: '600', lineHeight: '43px' }}>
              <p style={{ marginTop: 'auto', fontSize: '12px', color: '#000', marginBottom: 0 }}>总计：&nbsp;</p>
              <em style={{ fontSize: '12px', marginTop: 'auto' }}>￥</em>
              <p style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: '40px', height: '25px' }}>{totalPrice.split('.')[0]}</p>
              <em style={{ fontSize: '12px', marginTop: 'auto', fontWeight: 'bold' }}>.{totalPrice.split('.')[1]}</em>
            </div>
          </div>
        </div>
      </div>

      {/* 二维码弹框 */}
      <Modal
        title={`${payMethodName}扫码支付`}
        visible={visible}
        closable={true}
        maskClosable={false}
        onCancel={() => { setVisible(false); requestStatusEnable = false; history.push('/user/profile'); }}
        footer={false}
        width={360}
        style={{top:'35%'}}
        bodyStyle={{ padding: '10px 0 0 0'}}
      >
        <>
          <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', padding: '10px 0' }}>
            {qrcodeUrl !== '' ? <QRCode value={qrcodeUrl} size={200} /> : ''}
            <div style={{ display: 'flex', alignItems: 'center', width: '200px', marginTop: '12px', color: '#8a8a8a', justifyContent: 'space-between' }}>
              <img src='http://cdn.shakingcloud.com/icon/saoyisao.png' width={30} />
              <div>
                <p style={{ margin: 0 }}>{selectedMethod === 'wxPayNative' ? '请' : ''}打开手机{payMethodName}</p>
                <p style={{ margin: 0 }}>扫描二维码支付</p>
              </div>
            </div>
          </div>
          <div style={{ background: '#f0f0f0', width: '100%', height: '1px' }} />
          <div style={{ display: 'flex', justifyContent: 'center', lineHeight: '40px' }}>支付金额：<p style={{ color: appInfo?.theme?.baseColor, fontWeight: '600', margin: 0 }}>￥{totalPrice}</p></div>

          <div className={styles.payWarning}>
            <WarningOutlined style={{ color: 'red', fontSize: '18px', marginRight: '10px' }} />
            <Marquee pauseOnHover gradient={false}>
              <p style={{ margin: 0 }}>{`手机截屏保存二维码，打开手机${payMethodName}，打开扫一扫，选择相册找到刚保存的二维码进行扫码支付`}</p>
            </Marquee>
          </div>
        </>
      </Modal>

      <div className={styles.fixedWrapper}>
        <div style={{ color: appInfo?.theme?.baseColor, display: 'flex', marginLeft: 'auto', marginRight: '20px' }}>
          <p style={{ marginTop: 'auto', fontSize: '14px', color: '#000' }}>实付：</p>
          <em style={{ fontSize: '14px', marginTop: 'auto' }}>￥</em>
          <p style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '25px', height: '26px' }}>{totalPrice.split('.')[0]}</p>
          <em style={{ fontSize: '14px', marginTop: 'auto', fontWeight: 'bold' }}>.{totalPrice.split('.')[1]}</em>
        </div>
        <ButtonCom text='立即支付' type='primary' width={160} height={48} loading={submiting} background={appInfo?.theme?.baseColor} color='#fff' block={true} onPress={submit} />
      </div>
    </div>
  );
};

export default AppPage;
