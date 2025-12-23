import React, { useState } from 'react';
import { useHistory } from '@aniyajs/plugin-router'
import { Button, Card, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '@/services/user';
import { BetaSchemaForm, ProFormColumnsType } from '@ant-design/pro-components';
import styles from './index.module.less';

export default (): React.ReactNode => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 返回登录页面
  const handleBackToLogin = () => {
    history.push('/sys/login');
  };

  // 处理注册提交
  const handleRegister = async (values: any) => {
    const { account, password, confirmPassword } = values;
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({ account, password });

      if (res?.code === 200) {
        // 注册成功，跳转到登录页
        message.success('注册成功');
        history.replace('/sys/login');
      } else {
        setError(res?.message || '注册失败');
      }
    } catch (err) {
      setError('注册过程中出现错误');
    } finally {
      setLoading(false);
    }
  };

  const formColumns: ProFormColumnsType<UserTypes.AccountLoginRegistReq>[] = [
    {
      title: '用户名',
      dataIndex: 'account',
      fieldProps: {
        prefix: <UserOutlined />,
        placeholder: '请输入用户名',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入用户名' }],
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'password',
      fieldProps: {
        prefix: <LockOutlined />,
        placeholder: '请输入密码',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入密码' }],
      },
    },
    {
      title: '确认密码',
      dataIndex: 'confirmPassword',
      valueType: 'password',
      fieldProps: {
        prefix: <LockOutlined />,
        placeholder: '请再次输入密码',
      },
      formItemProps: {
        rules: [{ required: true, message: '请再次输入密码' }],
      },
    },
  ];

  return (
    <Card
      title={<h2 className={styles.title}>用户注册</h2>}
      extra={<p className={styles.extraText}>创建您的账户</p>}
      className={styles.card}
    >
      {error && (
        <div className={styles.errorContainer}>
          <Row align="middle">
            <Col span={2}>
              <span className={styles.errorIcon}>⚠</span>
            </Col>
            <Col span={22}>
              <span className={styles.errorText}>{error}</span>
            </Col>
          </Row>
        </div>
      )}

      <BetaSchemaForm
        layoutType="Form"
        columns={formColumns}
        onFinish={handleRegister}
        submitter={{
          render: (_, dom) => (
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                {loading ? '注册中...' : '注册'}
              </Button>
            </div>
          ),
        }}
      />

      <div className={styles.footer}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToLogin}
        >
          已有账号？立即登录
        </Button>
      </div>
    </Card>
  );
};