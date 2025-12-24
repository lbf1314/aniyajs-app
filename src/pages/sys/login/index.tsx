import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '@aniyajs/plugin-tooltik'
import { useHistory } from '@aniyajs/plugin-router'
import { getCodeAsync, loginAsync } from '@/models/user';
import { Button, Card, Row, Col, Spin, Input } from 'antd';
import { UserOutlined, LockOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { BetaSchemaForm, ProFormColumnsType } from '@ant-design/pro-components';

export default (): React.ReactNode => {
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state?.user)
  const { verificationCode, loading, verificationLoading } = state;

  // 登录表单状态
  const [error, setError] = useState('');

  const fetchCaptcha = async () => {
    const res = await dispatch((getCodeAsync as any)())

    if (res?.error) {
      setError(res?.error?.message);
    }
  }

  // 处理登录提交
  const handleLogin = async (values: any) => {
    const { account, password, captcha } = values;
    setError('');

    const res = await dispatch((loginAsync as any)({ account, password, captcha }))

    if (res?.error) {
      fetchCaptcha()
      setError(res?.error?.message);
    } else {
      history.replace('/');
    }
  };

  // 添加注册跳转函数
  const handleRegister = () => {
    history.push('/sys/register');
  };

  // 添加邮箱登录跳转函数
  const handleEmailLogin = () => {
    history.push('/sys/emailLogin');
  };

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const formColumns: ProFormColumnsType<UserTypes.AccountLoginRegistReq>[] = [
    {
      title: '用户名',
      dataIndex: 'account',
      initialValue: 'admin',
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
      initialValue: '123456',
      fieldProps: {
        prefix: <LockOutlined />,
        placeholder: '请输入密码',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入密码' }],
      },
    },
    {
      title: '验证码',
      dataIndex: 'captcha',
      initialValue: '1234',
      fieldProps: {
        prefix: <LockOutlined />,
        placeholder: '请输入验证码',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入验证码' }],
      },
      renderFormItem: (_, props) => {
        return (
          <Row gutter={8}>
            <Col span={14}>
              <Input placeholder="请输入验证码" {...props} />
            </Col>
            <Col span={10}>
              <div className={styles.captchaContainer}>
                {verificationLoading ? (
                  <div className={styles.loadingContainer}>
                    <Spin size="small" />
                  </div>
                ) : (
                  <div style={{ position: 'relative', height: '100%' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: verificationCode }}
                      className={`${styles.verificationCode} ${styles.captchaImage}`}
                      onClick={fetchCaptcha}
                    />
                    <Button
                      type="link"
                      icon={<ReloadOutlined />}
                      onClick={fetchCaptcha}
                      className={styles.reloadButton}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )
      }
    },
  ];

  return (
    <Card
      title={<h2 className={styles.title}>用户登录</h2>}
      extra={<p className={styles.extraText}>请输入您的账户信息</p>}
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
        onFinish={handleLogin}
        submitter={{
          render: (_, dom) => (
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </div>
          ),
        }}
      />

      <div className={styles.footer}>
        <p className={styles.footerText}>演示账号: admin / 123456</p>
        <div>
          <Button
            type="link"
            onClick={handleEmailLogin}
            style={{ marginRight: '8px' }}
          >
            邮箱登录
          </Button>
          <span style={{ color: '#d9d9d9' }}>|</span>
          <Button
            type="link"
            onClick={handleRegister}
            style={{ marginLeft: '8px' }}
          >
            还没有账号？立即注册
          </Button>
        </div>
      </div>
    </Card>
  );
};