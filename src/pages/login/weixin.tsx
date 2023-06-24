import React, { useCallback, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import DesUtils from '@/utils/DesUtils';
import api from '@/services/api';
import { Button, Checkbox, Form, message } from 'antd';

const LoginPage = (props: any) => {
  const [form] = Form.useForm();
  const [verifi] = Form.useForm();
  const [mobile, setMobile] = useState('');
  const [submiting, setSubmiting] = useState(false);
  const code = props.location.query.code;

  const submit = async () => {
    setSubmiting(true);
    api.user.wxlogin({ code: code }).then((response: any) => {
      setSubmiting(false);
      if (response.success) {
        Cookies.set('openId', response.data.wxMpOpenId, { expires: 7 });
        message.success({
          content: response.msg,
        });
        history.push({ pathname: '/' });
      } else {
        message.error({
          content: response.msg,
        });
      }
    });
  };

  return (
    <>
      <div>
        <div
          style={{
            backgroundColor: '#09bb07',
            display: 'flex',
            height: '230px',
            alignItems: 'center',
            justifyContent: 'center',
            flexFlow: 'column',
          }}
        >
          <img
            src="https://cdn.shakingcloud.com/nftea/%E8%B4%A6%E6%88%B7%E5%AE%89%E5%85%A8.png"
            width="80px"
            height="80px"
          />
          <p style={{ color: '#f1f1f1', fontSize: '15px', marginTop: '20px' }}>
            数字宝藏网页需要得到您的授权，才可继续操作
          </p>
        </div>
        <div className="wxlogin-checkbox">
          <Checkbox defaultChecked disabled>
            获得您的公开信息（昵称、头像等）
          </Checkbox>
        </div>
        <div
          style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}
        >
          <Button
            block
            color="primary"
            size="large"
            style={{ backgroundColor: '#09bb07' }}
            loading={submiting}
            onClick={submit}
          >
            确认授权
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
