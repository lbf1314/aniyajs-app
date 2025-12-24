import React, { useState, useEffect } from 'react';
import { BetaSchemaForm } from '@ant-design/pro-components';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { Form, Button, Spin, message, Card, Typography, Space, Input } from 'antd';
import { useHistory } from '@aniyajs/plugin-router';
import { useSelector } from '@aniyajs/plugin-tooltik'
import userApi from '@/services/user';
import styles from './index.module.less';
import { iconMap } from '@/utils/constant';

const { Title } = Typography;

interface ChangeEmailFormData {
  oldEmail: string;
  oldEmailCaptcha: string;
  newEmail: string;
}

export default (): React.ReactNode => {
  const { currentUserData: { userInfo } } = useSelector((state: RootState) => state?.user)

  const [form] = Form.useForm<ChangeEmailFormData>();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const columns: ProFormColumnsType<ChangeEmailFormData>[] = [
    {
      title: '当前邮箱',
      dataIndex: 'oldEmail',
      valueType: 'text',
      initialValue: userInfo?.email,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入当前邮箱',
          },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱格式',
          },
        ],
      },
      fieldProps: {
        placeholder: '请输入当前邮箱',
        prefix: iconMap('EmailSvg_Custom'),
      },
      width: 'lg',
    },
    {
      title: '当前邮箱验证码',
      dataIndex: 'oldEmailCaptcha',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入验证码',
          },
          {
            len: 6,
            message: '验证码为6位数字',
          },
        ],
      },
      fieldProps: {
        placeholder: '请输入验证码',
        prefix: iconMap('EmailCaptchaSvg_Custom'),
      },
      width: 'lg',
      renderFormItem: (schema, { value }) => {
        return (
          <Space>
            {/* @ts-ignore */}
            <Input value={value} {...schema?.fieldProps ?? {}} />
            <Button
              disabled={countdown > 0 || sendLoading}
              loading={sendLoading}
              onClick={sendCaptcha}
            >
              {countdown > 0 ? `${countdown}秒后重新获取` : '发送验证码'}
            </Button>
          </Space>
        )
      },
    },
    {
      title: '新邮箱',
      dataIndex: 'newEmail',
      valueType: 'text',
      hideInForm: !userInfo?.email,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入新邮箱',
          },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱格式',
          },
        ],
      },
      fieldProps: {
        placeholder: '请输入新邮箱',
        prefix: iconMap('EmailSvg_Custom'),
      },
      width: 'lg',
    }
  ];

  // 发送验证码
  const sendCaptcha = async () => {
    const oldEmail = form.getFieldValue('oldEmail');
    if (!oldEmail) {
      message.error('请输入当前邮箱');
      return;
    }

    setSendLoading(true);
    try {
      // 这里应该调用发送验证码的接口
      // 暂时模拟发送成功
      const res = await userApi.sendVerificationCode({ email: oldEmail }); // 需要根据实际API调整

      if (res?.code === 200) {
        message.success('验证码已发送');
        setCountdown(60);
      } else {
        message.error(res?.message || '验证码发送失败');
      }
    } catch (error) {
      message.error('验证码发送失败');
    } finally {
      setSendLoading(false);
    }
  };

  const onFinish = async (values: ChangeEmailFormData) => {
    setLoading(true);

    try {
      const res = await userApi.updateEmail({
        lastEmail: values.oldEmail,
        captcha: values.oldEmailCaptcha,
        newEmail: values.newEmail,
      });

      setLoading(false);

      if (res?.code === 200) {
        message.success(userInfo?.email ? '邮箱换绑成功' : '邮箱绑定成功');
        history.goBack();
      } else {
        message.error(res?.message || (userInfo?.email ? '邮箱换绑失败' : '邮箱绑定失败'));
      }
    } catch (error) {
      setLoading(false);
      message.error(userInfo?.email ? '邮箱换绑失败' : '邮箱绑定失败');
    }
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={styles.changeEmailContainer}>
      <Card className={styles.passwordCard}>
        <div className={styles.header}>
          <Title level={3}>{userInfo?.email ? '换绑邮箱' : '绑定邮箱'}</Title>
          {userInfo?.email ? <p className={styles.description}>为了账户安全，请验证当前邮箱并输入新邮箱</p> : null}
        </div>

        <Spin spinning={loading}>
          <BetaSchemaForm<ChangeEmailFormData>
            form={form}
            layoutType="Form"
            onFinish={onFinish}
            columns={columns}
            submitter={{
              render: (_, dom) => (
                <div className={styles.buttonGroup}>
                  {dom}
                  <Button onClick={goBack}>取消</Button>
                </div>
              ),
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};