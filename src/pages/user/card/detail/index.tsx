import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import moment from 'moment';
import Styles from './index.module.less';
import { message } from 'antd';
import IconFont from '@/components/IconFont';
import { useParams } from '@umijs/max';

const AppPage = (props: any) => {
  const params  = useParams();
  
  const [card, setCard] = useState({
    benefits: [],
    validityType: 'forever',
    days: 0
  });
  //应用信息
  const [appInfo, setAppInfo] = useState(
    JSON.parse(localStorage.getItem('appInfo')),
  );

  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.user.card_detail({ key: params.key }).then((res) => {
      message.destroy();
      if (res.success) {
        setCard(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  const renderValidTime = () => {
    if (card.validityType === 'forever') {
      return <span>永久有效</span>;
    } else if (card.validityType === 'perdiem') {
      return <span>{card.days}天</span>;
    } else if (card.validityType === 'period') {
      return (
        <span>
          {moment(card.beginDate).format('YYYY-MM-DD')} 至{' '}
          {moment(card.endDate).format('YYYY-MM-DD')}
        </span>
      );
    }
  };

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><p>我的权益卡</p></div>
      <div className={Styles.cardDetail}>
        <div className={Styles.cardimg}>
          <img src={card.background}/>
        </div>
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
              {card.effectiveTimes == null ? '永久有效' : card.effectiveTimes}
            </span>
          </div>
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
