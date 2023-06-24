import React, { useCallback, useContext, useState, FC, useEffect } from 'react';
import { useHistory } from 'umi';
import { CustomIcon } from '@/components/CustomIcon';
import api from '@/services/api';
import { message } from 'antd';

const AppPage = (props: any) => {
  useEffect(() => {
    message.loading({
      content: '正在支付',
      duration: 0,
    });
    document?.forms[0]?.submit();
  }, []);

  return (
    <>
      {<div dangerouslySetInnerHTML={{ __html: props.location.state?.form }} />}
    </>
  );
};

export default AppPage;
