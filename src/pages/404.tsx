import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { history } from '@umijs/max';

export default () => {
  useEffect(() => {
    document.body.style.background = 'var(--body-panel-background-color)';
  }, []);
  return (
    <div className='page-body' style={{height:'100vh',display:'flex',justifyContent:'center'}}>
      <Result
        status="404"
        title="404"
        subTitle="UH OH! 页面丢失了"
        extra={<Button onClick={() => history.push('/')}>返回首页</Button>}
      />
    </div>
  );
};
