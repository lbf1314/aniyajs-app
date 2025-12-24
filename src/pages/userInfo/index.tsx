// src/pages/userInfo/index.tsx
import React, { useEffect, useState } from 'react';
import { Card, Avatar, Row, Col, Descriptions, Typography, Button, Form, Input, Select, message, Spin, Image } from 'antd';
import { useSelector, useDispatch } from '@aniyajs/plugin-tooltik'
import styles from './index.module.less';
import { getUserInfoAsync, updateAvatarAsync, updateUserInfoAsync } from '@/models/user';
import { useHistory } from '@aniyajs/plugin-router';
import { iconMap } from '@/utils/constant';

const { Title, Text } = Typography;
const { Option } = Select;

const UserInfo: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUserData: { userInfo }, updateUserInfoLoading, updateAvatarLoading, loading } = useSelector((state: RootState) => state?.user)
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      const res = await dispatch((updateAvatarAsync as any)(formData))

      if (res?.error) {
        message.error(res?.error?.message || '头像上传失败');
      }
    }
  };

  const handleEdit = () => {
    form.setFieldsValue(userInfo);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await dispatch((updateUserInfoAsync as any)(values))

      if (res?.error) {
        message.error(res?.error?.message || '信息保存失败');
      } else {
        setIsEditing(false);
        message.success('信息保存成功');
      }
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handlePreview = () => {
    if (userInfo?.avatar) {
      setPreviewImage(userInfo?.avatar ?? '');
      setPreviewOpen(true);
    }
  };

  useEffect(() => {
    dispatch((getUserInfoAsync as any)())
  }, [])

  return (
    <Spin spinning={loading}>
      <div className={styles.userCenter}>
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              <Spin spinning={updateAvatarLoading}>
                <Avatar
                  size={100}
                  src={userInfo?.avatar}
                  icon={iconMap('UserOutlined')}
                  className={styles.avatar}
                  onClick={handlePreview}
                />
              </Spin>
              <label htmlFor="avatar-upload" className={styles.cameraIcon}>
                {iconMap('CameraOutlined')}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <Title level={3} className={styles.nickname}>{userInfo?.nickname}</Title>
            <Text type="secondary">{userInfo?.remark}</Text>
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card
              loading={updateUserInfoLoading}
              title="用户信息"
              className={styles.infoCard}
              extra={
                !isEditing ? (
                  <Button
                    type="primary"
                    icon={iconMap('EditOutlined')}
                    onClick={handleEdit}
                  >
                    编辑信息
                  </Button>
                ) : (
                  <div>
                    <Button
                      type="primary"
                      icon={iconMap('SaveOutlined')}
                      onClick={handleSave}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </Button>
                    <Button
                      icon={iconMap('RollbackOutlined')}
                      onClick={handleCancel}
                    >
                      取消
                    </Button>
                  </div>
                )
              }
            >
              {!isEditing ? (
                <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
                  <Descriptions.Item label="昵称">{userInfo?.nickname}</Descriptions.Item>
                  <Descriptions.Item label="姓名">{userInfo?.name}</Descriptions.Item>
                  <Descriptions.Item label="性别">{userInfo?.sex}</Descriptions.Item>
                  <Descriptions.Item label="账号">{userInfo?.account}</Descriptions.Item>
                  <Descriptions.Item label="个性签名">{userInfo?.remark}</Descriptions.Item>
                  <Descriptions.Item label="注册时间">
                    {new Date(userInfo?.createdAt ?? '').toLocaleString('zh-CN')}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form form={form} layout="vertical">
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="昵称"
                        name="nickname"
                        rules={[{ required: true, message: '请输入昵称' }]}
                      >
                        <Input placeholder="请输入昵称" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名' }]}
                      >
                        <Input placeholder="请输入姓名" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="性别"
                        name="sex"
                        rules={[{ required: true, message: '请选择性别' }]}
                      >
                        <Select placeholder="请选择性别">
                          <Option value="男">男</Option>
                          <Option value="女">女</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="账号"
                        name="account"
                      >
                        <Input disabled placeholder="账号不可编辑" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="个性签名"
                        name="remark"
                      >
                        <Input.TextArea placeholder="请输入个性签名" autoSize={{ minRows: 2, maxRows: 4 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card>
          </Col>

          <Col span={24}>
            <Card title="账户信息" className={styles.infoCard}>
              <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
                <Descriptions.Item label="账户ID">{userInfo?.accountId}</Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {userInfo?.email || '未绑定'}<a style={{ marginLeft: 10 }} onClick={() => history.push('/changeEmail')}>去绑定</a>
                </Descriptions.Item>
                <Descriptions.Item label="修改密码">
                  <a onClick={() => history.push('/changePassword')}>去修改</a>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Image.PreviewGroup
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
        >
          <Image key="1" src={previewImage} width={200} />
        </Image.PreviewGroup>
      </div>
    </Spin>
  );
};

export default UserInfo;