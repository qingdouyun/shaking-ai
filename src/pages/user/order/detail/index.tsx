import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import BaseUtils from '@/utils/BaseUtils';
import { ButtonCom } from '@/components';
import Styles from './index.module.less';
import Assets from '@/assets/images';
import QRCode from 'qrcode.react';
import { Image, message, Modal } from 'antd';
import { history } from 'umi';
import Cookies from 'js-cookie';
import Marquee from 'react-fast-marquee';
import { useParams } from '@umijs/max';
import { WarningOutlined } from '@ant-design/icons';

let requestStatusEnable = true; 

const AppPage = (props: any) => {
  const params  = useParams();
  const sn = params.key;
  //应用信息
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));
  const [detail, setDetail] = useState<any>({
    items: [],
  });
  const [submiting, setSubmiting] = useState(false);
  //二维码
  const [visible, setVisible] =useState(false);
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const [payMethodName, setPayMethodName] = useState('');

  const [title, setTitle] = useState('我的订单详情');
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));

  const token = Cookies.get('token');

  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.order.detail({ 'orderSn': sn }).then((res) => {
      message.destroy();
      if (res.success) {
        setDetail(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  /**
   * 将对象转换为url参数形式
   */
  const urlEncode = (data: any) => {
    const _result = [];
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
  const getPaymentStatus = (osn: string, psn: string) => {
    api.order.getPaymentStatus({ 'paymentSn': psn }).then((response: any) => {
      message.destroy();
      if (response.success) {
        message.success({
          content: response.msg,
        });
        setQrcodeUrl('');
        setVisible(false);
        history.push({ pathname: '/user/order/detail/' + osn });
      }else{
        setTimeout(() => {
          if (requestStatusEnable) {
            getPaymentStatus(osn,psn);
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

  //立即支付
  const payment = () => {
    message.loading({
      content: '拉取支付',
      duration: 0,
    });
    setSubmiting(true);
    api.order.payment({
      'orderSn': sn,
      'paymentMethod': '',
      'subPayMethod': '', //子支付
      'payMethod': 'fullPayment',
      'bankParam': '1',
    }).then(async (response: any) => {
        setSubmiting(false);
        message.destroy();
        if (response.success) {
          // console.log(response);
          setPayMethodName(response.data.payMethodName);
          if (response.data.paymentMethod === 'wxPayNative') {
            if (response.data.code === "NO_AUTH") {
              message.error({content: response.data.message});
              return;
            }else{
              showQrcode(response.data.code_url);
              setTimeout(() => {
                requestStatusEnable = true;
                getPaymentStatus(sn,response.data.paymentSn);
              }, 2000);//延迟2秒钟再执行
            }
          }else if (response.data.paymentMethod === 'alipayQrcode') {
              showQrcode(response.data.code_url);
              setTimeout(() => {
                requestStatusEnable = true;
                getPaymentStatus(sn,response.data.paymentSn);
              }, 2000);//延迟2秒钟再执行
          }else if (response.data.paymentMethod === 'alipayH5') {
            // console.log(response);
            history.push('/goods/checkout/pay',{'form':response.data.formData});
          }
        } else {
          setSubmiting(false);
          message.error({
            content: response.msg,
          });
        }
    });
  };

  // 取消订单
  const calOrd = () => {
    Modal.confirm({
      content: '是否确定取消订单',
      onOk: async () => {
        message.loading({
          content: '正在取消',
          duration: 0,
        });
        api.order.cancel({'orderSn':sn}).then((response: any) => {
          if (response.success) {
            message.success({
              content: response.msg,
            });
            window.location.reload();
          } else {
            message.error({
              content: response.msg,
            });
          }
        });
      },
    });
  };

  const copyUtils = (content: any) => {
    const copy = (e: any) => {
      e.preventDefault();
      e.clipboardData.setData('text/plain', content);
      message.success('复制成功');
      document.removeEventListener('copy', copy);
    };
    document.addEventListener('copy', copy);
    document.execCommand('Copy');
  };

  //渲染内容
  const renderContent = () => {
    return <div className={Styles.orderDetail}>
            <div className={Styles.info}>
              {detail?.items.map((v: any, i: number) => (
                <div key={i} className={Styles.header}>
                  <img src={v.image} alt="" />
                  <div className={Styles.con}>
                    <div style={{fontSize:'15px'}}>{v.fullName}</div>
                  </div>
                  {/*<img src={Assets.arrowGray} className={Styles.arrow} alt="" />*/}
                </div>
              ))}
              <div style={{ padding: 16,borderBottom:`2px solid ${appInfo.theme.bgColor}` }}>
                <div className={Styles.item} style={{fontSize:'14px'}}>
                  <div className={Styles.label}>订单金额：</div>
                  <div className={Styles.text}>￥{detail.amount}</div>
                </div>
                <div className={Styles.item} style={{fontSize:'14px'}}>
                  <div className={Styles.label}>订单编号：</div>
                  <div className={Styles.text}>{detail.sn}</div>
                  <img
                    src={Assets.copy}
                    className={Styles.copy}
                    alt=""
                    style={{width:'20px',height:'20px'}}
                    onClick={() => copyUtils(detail.sn)}
                  />
                </div>
                <div className={Styles.item} style={{fontSize:'14px'}}>
                  <div className={Styles.label}>下单时间：</div>
                  <div className={Styles.text}>{detail.createDate}</div>
                </div>
                {detail?.status === 'unpaid' && (
                  <div className={Styles.item} style={{fontSize:'14px'}}>
                    <div className={Styles.label}>过期时间：</div>
                    <div className={Styles.text}>{detail.expired}</div>
                  </div>
                )}
                <div className={Styles.item} style={{fontSize:'14px'}}>
                  <div className={Styles.label}>支付方式：</div>
                  <div className={Styles.text}>{detail.payMethodName}</div>
                </div>
                <div className={Styles.item} style={{fontSize:'14px'}}>
                  <div className={Styles.label}>订单状态：</div>
                  <div className={Styles.text}>{detail.statusName}</div>
                </div>
              </div>
            </div>
            <div style={{background:'#fff'}} hidden={BaseUtils.isEmpty(detail.memo)}>
              <div style={{fontSize:'14px',padding:'15px 20px',background:'#fafafa'}}>备注</div>
              <div style={{padding:'10px',fontSize:'14px',lineHeight:'22px'}} dangerouslySetInnerHTML={{ __html: detail.memo }} />
              <div style={{padding:'20px',display:'flex',justifyContent:'center'}}>
                <ButtonCom
                    text="点此复制"
                    type="primary"
                    block={true}
                    width={520}
                    height={40}
                    background={appInfo?.theme?.baseColor} 
                    color='#fff'
                    onPress={() => copyUtils(detail.memo)}
                />
              </div>
            </div>
            {detail?.status === 'unpaid' && (
              <div className={Styles.buttonWrapper} style={{background:'#fff'}}>
                <ButtonCom
                  text="取消订单"
                  block={true}
                  width={160}
                  height={40}
                  onPress={calOrd}
                />
                <ButtonCom
                  text="立即支付"
                  type="primary"
                  block={true}
                  width={160}
                  height={40}
                  loading={submiting}
                  background={appInfo?.theme?.baseColor} 
                  color='#fff'
                  onPress={payment}
                />
              </div>
            )}

          {/* 二维码弹框 */}
          <Modal
            title={`${payMethodName}扫码支付`}
            visible={visible}
            closable={true}
            maskClosable={false}
            onCancel={() => {setVisible(false);requestStatusEnable=false;}}
            footer={false}
            width={360}
            bodyStyle={{padding:'10px 0 0 0',top: 40}}
          >
            <>
              <div style={{display:'flex',flexFlow:'column',alignItems:'center',padding:'10px 0'}}>
                  {qrcodeUrl!==''?<QRCode value={qrcodeUrl} size={200}/>:''}
                  <div style={{display:'flex',alignItems:'center',width:'200px',marginTop:'12px',color:'#8a8a8a',justifyContent:'space-between'}}>
                      <img src='http://cdn.shakingcloud.com/icon/saoyisao.png' width={30}/>
                      <div>
                          <p style={{margin:0}}>{payMethodName==='微信'?'请':''}打开手机{payMethodName}</p>
                          <p style={{margin:0}}>扫描二维码支付</p>
                      </div>
                  </div>
              </div>
              <div style={{background:'#f0f0f0',width:'100%',height:'1px'}}/>
              <div style={{display:'flex',justifyContent:'center',lineHeight:'40px'}}>支付金额：<p style={{color:appInfo?.theme?.baseColor,fontWeight:'600',margin:0}}>￥{detail.amount}</p></div>
              
              <div className={Styles.payWarning}>
                <WarningOutlined style={{color:'red',fontSize:'18px',marginRight:'10px'}}/>
                <Marquee pauseOnHover gradient={false}>
                  <p style={{margin:0}}>{`手机截屏保存二维码，打开手机${payMethodName}，打开扫一扫，选择相册找到刚保存的二维码进行扫码支付`}</p>
                </Marquee>
              </div>
            </>
          </Modal>

          </div>
  }

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'14px',lineHeight:'40px'}}><p>我的订单详情</p></div>
      {renderContent()}
    </>
  );
};

export default AppPage;
