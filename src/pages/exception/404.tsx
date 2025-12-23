import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from '@aniyajs/plugin-router';

const Exception404 = () => {
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，你访问的接口不存在."
      extra={
        <Button type="primary" onClick={() => history.push('/')}>返回首页</Button>
      }
    />
  );
};

export default Exception404;
