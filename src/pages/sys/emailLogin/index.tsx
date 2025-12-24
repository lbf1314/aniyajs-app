import React, { useState, useEffect } from 'react';
import { useDispatch } from '@aniyajs/plugin-tooltik'
import { useHistory } from '@aniyajs/plugin-router'
import { Button, message, Card, Row, Col, Input } from 'antd';
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import userApi from '@/services/user';
import { BetaSchemaForm, ProFormColumnsType } from '@ant-design/pro-components';
import styles from './index.module.less';

export default (): React.ReactNode => {
  const history = useHistory();
  const dispatch = useDispatch();

  // 表单状态
  const [countdown, setCountdown] = useState(0); // 倒计时
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false); // 发送验证码loading状态
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // 发送验证码倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // 发送验证码
  const handleSendCaptcha = async () => {
    if (!email) {
      setError('请输入邮箱');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailRegex.test(email)) {
      setError('请输入正确的邮箱');
      return;
    }

    try {
      setSendLoading(true); // 开始发送loading
      setError(''); // 清除之前的错误

      // 这里应该调用发送验证码的接口
      const res = await userApi.sendVerificationCode({ email }); // 需要根据实际API调整

      if (res?.code === 200) {
        setCountdown(60);
      } else {
        setError(res?.message || '验证码发送失败');
      }
    } catch (error) {
      setError('验证码发送失败');
    } finally {
      setSendLoading(false); // 结束发送loading
    }
  };

  // 处理登录提交
  const handleEmailLogin = async (values: any) => {
    const { email, captcha } = values;

    setError('');

    if (!email) {
      setError('请输入邮箱');
      return;
    }

    if (!captcha) {
      setError('请输入验证码');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailRegex.test(email)) {
      setError('请输入正确的邮箱');
      return;
    }

    try {
      setLoading(true);
      const res = await userApi.emailLogin({
        captcha,
        email,
      });

      if (res?.code === 200) {
        localStorage.setItem('loginResult', JSON.stringify(res?.result ?? []));
        // 跳转到账号选择页面
        history.replace('/sys/accountSelect');
      } else {
        setError(res?.message || '登录失败，请稍后重试');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 返回登录页面
  const handleBackToLogin = () => {
    history.push('/sys/login');
  };

  const formColumns: ProFormColumnsType<UserTypes.EmailLoginReq>[] = [
    {
      title: '邮箱',
      dataIndex: 'email',
      fieldProps: {
        prefix: <MailOutlined />,
        placeholder: '请输入邮箱',
        onChange: (e: any) => setEmail(e.target.value),
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入邮箱!' },
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式!' }
        ],
      },
    },
    {
      title: '验证码',
      dataIndex: 'captcha',
      fieldProps: {
        prefix: <LockOutlined />,
        placeholder: '请输入验证码',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入验证码!' }],
      },
      renderFormItem: (_, props) => (
        <Row gutter={8}>
          <Col span={14}>
            <Input name="captcha" placeholder='请输入验证码' {...props} />
          </Col>
          <Col span={10}>
            <Button
              block
              type="primary"
              onClick={handleSendCaptcha}
              loading={sendLoading}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
            </Button>
          </Col>
        </Row>
      )
    },
  ];

  return (
    <Card
      title={<h2 className={styles.title}>邮箱登录</h2>}
      extra={<p className={styles.extraText}>请输入您的邮箱和验证码</p>}
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
        onFinish={handleEmailLogin}
        submitter={{
          render: (_, dom) => (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          ),
        }}
      />

      <div className={styles.footer}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToLogin}
        >
          返回登录
        </Button>
      </div>
    </Card>
  );
};