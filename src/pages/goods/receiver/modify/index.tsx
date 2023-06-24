import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { areaInfo } from '@/constants/address'
import Styles from './index.module.less'
import { ButtonCom } from "@/components";
import { Cascader, Checkbox, Form, Input, message } from 'antd';
import { history } from '@umijs/max';
import { useLocation } from '@umijs/max';

const FormPage = (props: any) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [submiting, setSubmiting] = useState(false);
  const [appInfo, setAppInfo] = useState(JSON.parse(localStorage.getItem("appInfo")));//应用信息

  useEffect(() => {
    const detail = location?.state?.detail;
    detail.areaName = detail.areaName.split(',');
    form.setFieldsValue(detail);
  }, []);

  const submit = async () => {
    const values = await form.validateFields();
    values.areaName = values.areaName.join(',');
    setSubmiting(true);
    api.user.modify_address(values).then((res) => {
      setSubmiting(false);
      message.destroy();
      if (res.success) {
        message.success(res.msg);
        history.back();
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <>
      <div className={Styles.modifyAddress}>
        <Form
          layout="horizontal"
          form={form}
          className={Styles.form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            'isDefault': false
          }}
        >
          <Form.Item hidden name='key'><Input /></Form.Item>
          <Form.Item
            name="consignee"
            rules={[{ required: true, message: '请输入姓名' }]}
            className={Styles.item}
            label="收货人"
          >
            <Input placeholder="请输入姓名" maxLength={20} />
          </Form.Item>
          <Form.Item
            className={Styles.item}
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            className={Styles.item}
            name="areaName"
            label="收货地区"
            rules={[{ required: true, message: '请输入地区' }]}
          >
            <Cascader options={areaInfo} placeholder="请选择地区" />
          </Form.Item>
          <Form.Item
            className={Styles.item}
            name="address"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder='街道、小区、门牌号等' />
          </Form.Item>
          <Form.Item label="是否默认" name="isDefault" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Form>

        <div className={Styles.buttonWrapper}>
          <ButtonCom text='保存' loading={submiting} type='primary' block={true} width={320} height={48} background={appInfo?.theme?.baseColor} color='#fff' onPress={submit} />
        </div>

      </div>
    </>
  );
};

export default FormPage;
