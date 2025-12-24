import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from '@aniyajs/plugin-router';
import { Card, Row, Col, Spin, Button, Avatar, Typography, Result, Space } from 'antd';
import { LogoutOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useDispatch, useSelector } from '@aniyajs/plugin-tooltik';
import api from '@/services/user';

const { Title, Text } = Typography;

interface AccountInfo {
  account: string;
  id: string;
  avatar: string;
  token: string;
}

interface AccountSelectParams {
  pageType: string;
}

export default (): React.ReactNode => {
  const params = useParams<AccountSelectParams>()
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state?.user)
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const loginResult = JSON.parse(localStorage.getItem('loginResult') ?? '[]');

  // 点击账号卡片进入系统
  const handleSelectAccount = (accountInfo: AccountInfo) => {
    try {
      // 保存选中的账号信息到全局状态或本地存储
      localStorage.setItem('token', accountInfo?.token);

      // 跳转到管理系统首页
      history.replace('/');
    } catch (error) {
      console.error('切换账号失败:', error);
    }
  };

  // 退出登录
  const handleLogout = () => {
    // 清除登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('loginResult');
    dispatch({
      type: 'user/save',
      payload: {
        currentUserData: {
          userInfo: {},
          doms: [],
          menus: [],
        }
      }
    });

    // 跳转到登录页
    history.replace('/sys/emailLogin');
  };

  if (loading) {
    return (
      <div className={styles["account-select-loading"]}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className={styles["account-select-container"]}>
      <div className={styles["account-select-header"]}>
        <Title level={2}>选择您的账号</Title>
        <Text type="secondary">请选择要登录的账号进入管理系统</Text>
      </div>

      {loginResult?.length > 0 ? (
        <>
          <div className={styles["account-cards"]}>
            <Row gutter={[24, 24]}>
              {loginResult?.map((account: UserTypes.LoginResult) => (
                <Col xs={24} sm={12} lg={8} key={account.id}>
                  <Card
                    hoverable
                    className={styles["account-card"]}
                    onClick={() => handleSelectAccount(account)}
                    styles={{
                      body: {
                        padding: 12
                      }
                    }}
                  >
                    <div className={styles["account-info"]}>
                      <div className={styles["avatar-section"]}>
                        {account.avatar ? (
                          <Avatar
                            size={64}
                            src={account.avatar}
                          />
                        ) : (
                          <Avatar size={64} icon={<UserOutlined />} />
                        )}
                      </div>
                      <div className={styles["account-details"]}>
                        <Title level={4} className={styles["account-name"]}>{account.account}</Title>
                        <Text className={styles["account-dec"]} type="secondary">点击进入系统</Text>
                      </div>
                    </div>
                    <div className={styles["card-footer"]}>
                      <ArrowRightOutlined color='#00000073' />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div className={styles["logout-section"]}>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </>
      ) : (
        <div className={styles["empty-state"]}>
          <Result
            status="warning"
            title="暂无可用账号"
            subTitle="您还没有可用的账号，请先登录或注册。"
            extra={
              <Button type="primary" onClick={() => history.push('/sys/emailLogin')}>
                返回登录
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};