import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from '@aniyajs/plugin-router';

const Exception403 = () => {
  const history = useHistory();

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，你无权访问该页面"
      extra={
        <Button type="primary" onClick={() => history.push('/')}>返回首页</Button>
      }
    />
  );
}

export default Exception403;