import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import Assets from '@/assets/images/wallet';
import { ButtonCom } from '@/components';
import Styles from './index.module.less';
import BaseUtils from '@/utils/BaseUtils';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { history } from '@umijs/max';
import AssetsCom from '@/assets/images/com';

const AppPage = (props: any) => {
  //应用信息
  const [appInfo, setAppInfo] = useState(
    JSON.parse(localStorage.getItem('appInfo')),
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem('userInfo')),
  );
  const token = Cookies.get('token');

  const [data, setData] = useState({
    cardno: '',
    points: 0,
    foreverPoints: 0,
    periodPoints: 0,
  });

  // 初始化方法
  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.user.points.account().then((res) => {
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
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}>
        <p>我的积分</p>
        <div className={Styles.walletAPrice} style={{ marginLeft: '0' }}>
          （共 {data.points || '0'} ℗）
        </div>
      </div>
      <div className={Styles.wallet}>
        <div className={Styles.bodyWallet}>
          {/* <div className={Styles.bodyWalletHead}>
            <img src={Assets.wallet} />
            <div>积分账户</div>
            <div className={Styles.walletAPrice} style={{ marginLeft: '0' }}>
              （共 {data.points || '0'} ℗）
            </div>
          </div> */}
          <div className={Styles.walletAItem}>
            <div>永久积分</div>
            <div className={Styles.walletAPrice}>
              {data.foreverPoints || '0'} ℗
            </div>
          </div>
          <div className={Styles.walletAItem}>
            <div>时效积分</div>
            <div className={Styles.walletAPrice}>
              {data.periodPoints || '0'} ℗
            </div>
          </div>
        </div>

        <div className={Styles.bodyWallet}>
          <div className={Styles.bodyWalletCon}>
            <div className={Styles.text}>充值记录</div>
            <div
              className={Styles.tip}
              onClick={() => {
                history.push('/user/points/recharge');
              }}
            >
              <span>去查看</span>
              <img src={AssetsCom.arrowGray} className={Styles.arrow} />
            </div>
          </div>
        </div>
        <div className={Styles.bodyWallet}>
          <div className={Styles.bodyWalletCon}>
            <div className={Styles.text}>消费明细</div>
            <div
              className={Styles.tip}
              onClick={() => {
                history.push('/user/points/consume');
              }}
            >
              <span>去查看</span>
              <img src={AssetsCom.arrowGray} className={Styles.arrow} />
            </div>
          </div>
        </div>

        <ButtonCom
          type="primary"
          block={true}
          text="购买积分"
          height={40}
          background={appInfo?.theme?.baseColor}
          color="#fff"
          className={Styles.button}
          onPress={() => {
            if (BaseUtils.isEmpty(userInfo.mobile)) {
              message.error("根据国家相关法律规定，请先完成手机号绑定！");
              history.push('/user/account/bind');
              return;
            }
            const pageUrl = appInfo?.buyPointsPagePath.replace('/pages', '');
            history.push(pageUrl);
          }}
        />
      </div>
    </>
  );
};

export default AppPage;
