import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { ButtonCom } from '@/components';
import Styles from './index.module.less';
import BaseUtils from '@/utils/BaseUtils';
import Assets from '@/assets/images/wallet';
import Cookies from 'js-cookie';
import { Button, Checkbox, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { history } from '@umijs/max';

const AppPage = (props: any) => {
  //应用信息
  const [appInfo, setAppInfo] = useState(
    JSON.parse(localStorage.getItem('appInfo')),
  );
  const [visible, setVisible] = useState(false);
  const [wallet, setWallet] = useState({
    walletAddress: '',
    balance: '',
    frozenBalance: '',
    deposits: [],
  });
  const options = [
    {
      label: '支付宝',
      value: 'zfb',
    },
    // {
    //   label: '银行卡',
    //   value: 'yhk',
    // },
  ];
  const token = Cookies.get('token');


  // 初始化方法
  useEffect(() => {
    message.loading({
      content: '加载中',
      duration: 0,
    });
    api.user.wallet().then((res) => {
      message.destroy();
      if (res.success) {
        setWallet(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  //表单提交
  const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 15,
    },
  };
  const [form] = Form.useForm();
  const [submitting,setSubmitting] = useState(false);
  //确定提交
  const apply = async() => {
    const values = await form.validateFields();
    if (BaseUtils.isEmpty(values.alipay)) {
      message.error('支付宝账号不能为空');
      return;
    }
    if (BaseUtils.isEmpty(values.amount) || values.amount < 100) {
      message.error('提现金额必须大于100元');
      return;
    }

    if (BaseUtils.isEmpty(values.memo)) {
      message.error('备注不能为空');
      return;
    }
    message.loading({
      content: '正在提交',
      duration: 0,
    });
    setSubmitting(true);
    api.user.withdraw_apply({...values}).then((res) => {
        message.destroy();
        setSubmitting(false);
        if (res.success) {
          setVisible(false);
          message.success(res.msg);
          window.location.reload();
        }else{
          message.error(res.msg);
        }
      });
  };

  return (
    <>
      <div className='menu-content-title' style={{fontSize:'15px',lineHeight:'40px'}}><img src={Assets.wallet} style={{width:'20px',height:'20px',marginRight:'10px'}}/><p>钱包账户</p></div>
      <div className={Styles.wallet}>
        <div className={Styles.bodyWallet}>
          {/* <div className={Styles.bodyWalletHead}>
            <div>余额明细</div>
          </div> */}
          <div className={Styles.walletAItem}>
            <div>我的余额</div>
            <div className={Styles.walletAPrice}>
              ¥ {wallet.balance || '0.00'}
            </div>
          </div>
          <div className={Styles.walletAItem}>
            <div>冻结金额</div>
            <div className={Styles.walletAPrice}>
              ¥ {wallet.frozenBalance || '0.00'}
            </div>
          </div>
        </div>

        {/* <div className={Styles.bodyWallet}>
          <div className={Styles.bodyWalletCon}>
            <div className={Styles.text}>
              我的提现记录
            </div>
            <div className={Styles.tip} onClick={()=>{}}>
              <span>去查看</span>
              <img
                src={AssetsCom.arrowGray}
                className={Styles.arrow}
              />
            </div>
          </div>
        </div> */}

        <ButtonCom
          type="primary"
          block={true}
          text="余额提现"
          height={40}
          background={appInfo?.theme?.baseColor}
          color="#fff"
          className={Styles.button}
          onPress={() => setVisible(true)}
        />
        <div onClick={() => history.push('/user/wallet/deposit')} style={{color:appInfo?.theme?.baseColor,lineHeight:'60px',textAlign:'center',cursor:'pointer'}}>查看明细</div>
      </div>

      <Modal forceRender
          title="提现申请"
          key="applyModal"
          maskClosable={false}
          visible={visible}
          closable={true}
          width={520}
          centered
          bodyStyle={{}}
          onOk={() => apply()}
          onCancel={() => setVisible(false)}
          footer={[
          <Button key="back" onClick={() => setVisible(false)}>
              取消
          </Button>,
          <Button key='confirm' type="primary" onClick={() => apply()} loading={submitting}>
              确认
          </Button>,
          ]}
      >
          <Form
              {...formLayout}
              hideRequiredMark={false}
              name="applyForm"
              form={form}
          >
            {/* <Form.Item
                label="提现方式"
                name="withdrawMethods"
            >
                <Checkbox.Group>
                    <Checkbox
                      key="alipay"
                      style={{margin:'0px 0px 5px 0px'}}
                      defaultChecked
                      value="alipay"
                      checked={true}
                    >
                        支付宝
                    </Checkbox>
                    <Checkbox
                      key="codPay"
                      style={{margin:'0px 0px 5px 0px'}}
                      defaultChecked
                      value="codPay"
                    >
                        银行卡
                    </Checkbox>
                </Checkbox.Group>
            </Form.Item> */}
            <Form.Item
                label="支付宝账号"
                name="alipay"
                rules={[
                    {
                        required: true,
                        message: '必填',
                    },
                ]}
            >
                <Input placeholder="请输入支付宝账号" />
            </Form.Item>
            <Form.Item
                label="提现金额"
                name="amount"
                rules={[
                    {
                        required: true,
                        message: '必填',
                    },
                ]}
            >
                <InputNumber placeholder="请输入提现金额" style={{width:'100%'}} />
            </Form.Item>
            <Form.Item
                label="备注信息"
                name="memo"
                rules={[
                    {
                        required: true,
                        message: '必填',
                    },
                ]}
            >
                <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </Form>
      </Modal>
    </>
  );
};

export default AppPage;
