import React, { useState } from 'react';
import { BetaSchemaForm } from '@ant-design/pro-components';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { Form, Button, Spin, message, Card, Typography } from 'antd';
import { useHistory } from '@aniyajs/plugin-router';
import userApi from '@/services/user';
import styles from './index.module.less';
import { iconMap } from '@/utils/constant';

const { Title } = Typography;

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default (): React.ReactNode => {
  const [form] = Form.useForm<ChangePasswordFormData>();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  const columns: ProFormColumnsType<ChangePasswordFormData>[] = [
    {
      title: '当前密码',
      dataIndex: 'currentPassword',
      valueType: 'password',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入当前密码',
          },
        ],
      },
      fieldProps: {
        placeholder: '请输入当前密码',
        prefix: iconMap('LockOutlined'),
      },
      width: 'lg',
    },
    {
      title: '新密码',
      dataIndex: 'newPassword',
      valueType: 'password',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入新密码',
          },
          {
            min: 6,
            message: '密码长度至少6位',
          },
          // {
          //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          //   message: '密码需包含大小写字母和数字',
          // },
        ],
      },
      fieldProps: {
        placeholder: '请输入新密码',
        prefix: iconMap('LockOutlined'),
      },
      width: 'lg',
    },
    {
      title: '确认新密码',
      dataIndex: 'confirmNewPassword',
      valueType: 'password',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请再次输入新密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ],
      },
      fieldProps: {
        placeholder: '请再次输入新密码',
        prefix: iconMap('LockOutlined'),
      },
      width: 'lg',
    },
  ];

  const onFinish = async (values: ChangePasswordFormData) => {
    if (values.newPassword === values.currentPassword) {
      message.error('新密码不能与当前密码相同');
      return;
    }

    setLoading(true);

    try {
      const res = await userApi.updatePassword({
        last: values.currentPassword,
        new: values.newPassword,
      });

      setLoading(false);

      if (res?.code === 200) {
        message.success('密码修改成功');
        history.goBack();
      } else {
        message.error(res?.message || '密码修改失败');
      }
    } catch (error) {
      setLoading(false);
      message.error('密码修改失败');
    }
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={styles.changePasswordContainer}>
      <Card className={styles.passwordCard}>
        <div className={styles.header}>
          <Title level={3}>修改密码</Title>
          <p className={styles.description}>为了账户安全，请定期更换密码</p>
        </div>

        <Spin spinning={loading}>
          <BetaSchemaForm<ChangePasswordFormData>
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