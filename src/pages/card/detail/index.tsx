import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import api from '@/services/api';
import moment from 'moment';
import Styles from './index.module.less';
import BaseUtils from '@/utils/BaseUtils';
import configs from '@/constants/configs';
import Cookies from 'js-cookie';
import IconFont from '@/components/IconFont';
import { Button, message } from 'antd';
import { useLocation } from '@umijs/max';
import { useParams } from '@umijs/max';

const AppPage = (props: any) => {
  const location = useLocation();
  const params  = useParams();
  
  const token = Cookies.get('token');
  const [card, setCard] = useState({
    'key': '',
    'obtainType': '',
    benefits: [],
  });
  //应用信息
  const [appInfo, setAppInfo] = useState(
    JSON.parse(localStorage.getItem('appInfo')),
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem('userInfo')),
  );


  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.card.detail({ key: params.key }).then((res) => {
      message.destroy();
      if (res.success) {
        setCard(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  const renderValidTime = () => {
    if (card.termType === 'forever') {
      return <span>永久有效</span>;
    } else if (card.termType === 'perdiem') {
      return <span>{card.days}天</span>;
    } else if (card.termType === 'period') {
      return (
        <span>
          {moment(card.beginDate).format('YYYY-MM-DD')} 至{' '}
          {moment(card.endDate).format('YYYY-MM-DD')}
        </span>
      );
    }
  };

  const [processing, setProcessing] = useState(false);

  //立即购买
  const confirmBuy = async () => {
    if (BaseUtils.isEmpty(token) || BaseUtils.isEmpty(userInfo)) {
      history.push({pathname: '/login?redirect'+location.pathname});
      return;
    }
    if (card.obtainType === 'direct') {
      //直接领取
      
    }else if (card.obtainType === 'buy') {
      if (BaseUtils.isEmpty(userInfo.mobile)) {
        message.error("根据国家相关法律规定，请先完成手机号绑定！");
        history.push('/user/account/bind');
        return;
      }
      history.push('/card/checkout',{'card': card});
    }
  }

  return (
    <>
      <div className={Styles.cardDetail} style={{background:appInfo?.theme?.bgColor}}>
        <div className={Styles.cardimg}>
          <img src={card.background}/>
          <div className={Styles.cardinfo}>
            <div className={Styles.item}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                有效期
              </div>
              {renderValidTime()}
            </div>
            <div className={Styles.item} hidden={card.type !== 'Points'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                积分数量
              </div>
              <span>{`${card.points}积分`}</span>
            </div>

            <div className={Styles.item} hidden={card.type !== 'TCCard'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconFont
                  type="icon-cishu"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginRight: '8px',
                  }}
                />
                有效次数
              </div>
              <span>
                {card.effectiveTimes === null ? '永久有效' : card.effectiveTimes}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            padding: '10px',
            background: '#fff',
            textAlign:'center'
          }}
          hidden={card.obtainType === 'trigger'}
        >
          <Button
            block
            color="primary"
            size="large"
            style={{
              margin: 'auto',
              width: '30%',
              borderRadius: '30px',
              color: 'white',
              background: appInfo?.theme?.baseColor,
            }}
            loading={processing}
            onClick={confirmBuy}
          >
            {card.obtainType === 'direct' ? '立即领取' : '立即购买'}
          </Button>
        </div>
        {JSON.stringify(card) !== '{}' ? (
          <>
            <div className={Styles.cardvip}>
              <div className={Styles.title}>特权权益</div>
              {card.benefits.map((item: any) => {
                let flagIcon = <></>;

                if (
                  item.benefitCode === 'discount' ||
                  item.benefitCode === 'pointsmultiple'
                ) {
                  if (item.benefitValue === '10' || item.benefitValue === '1') {
                    flagIcon = (
                      <div style={{color:'gray'}}><IconFont
                        type="icon-shibai"
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          marginRight: '8px',
                          color: '#000000',
                        }}
                      />✘</div>
                    );
                  } else {
                    if (item.benefitCode === 'discount') {
                      flagIcon = <span>{item.benefitValue}折</span>;
                    } else if (item.benefitCode === 'pointsmultiple') {
                      flagIcon = <span>{item.benefitValue}倍</span>;
                    }
                  }
                } else if (
                  item.benefitCode === 'freeship' ||
                  item.benefitCode === 'prioritybuy'
                ) {
                  if (item.benefitValue === 'true') {
                    flagIcon = (
                      <><IconFont
                        type="icon-weibiaoti5"
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          marginRight: '8px',
                          color: appInfo?.theme?.baseColor,
                        }}
                      />✔</>
                    );
                  } else if (
                    item.benefitValue === '10' ||
                    item.benefitValue === '1'
                  ) {
                    flagIcon = (
                      <div style={{color:'gray'}}><IconFont
                        type="icon-shibai"
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          marginRight: '8px',
                          color: '#000000',
                        }}
                      />✘</div>
                    );
                  }
                }

                return (
                  <div key={item.benefitCode} className={Styles.item}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={item.benefitIcon} width={26} />
                      &nbsp;&nbsp;{item.benefitName}
                    </div>
                    {flagIcon}
                  </div>
                );
              })}
            </div>
            <div className={Styles.cardvip}>
              <div className={Styles.title}>详情介绍</div>
              <div dangerouslySetInnerHTML={{ __html: card.introduction }} />
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default AppPage;
