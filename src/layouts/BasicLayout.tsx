import { PageContainer, ProCard, ProConfigProvider, ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { Avatar, Breadcrumb, Button, ConfigProvider, Dropdown, Result } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, AniyajsPluginRouterProps } from '@aniyajs/plugin-router'
import defaultSettings from 'config/defaultSettings';
import { convertData, flatArr } from '@/utils/utils';
import { iconMap } from '@/utils/constant';
import { useSelector, useDispatch } from '@aniyajs/plugin-tooltik'
import Authorized from '@/components/Authorized';
import { UserOutlined } from '@ant-design/icons';

export interface BasicLayoutType extends AniyajsPluginRouterProps {

}

export default (props: BasicLayoutType) => {
  const { settings, user } = useSelector((state: RootState) => state)
  const { currentUserData: { menus = [], userInfo = {} } } = user;
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { showHeaderRender, showMenuRender, showBreadcrumbRender, isLocalMenus } = defaultSettings;
  const { children, routers } = props;
  const [pathname, setPathname] = useState('/');
  const loginResult = JSON.parse(localStorage.getItem('loginResult') ?? '[]');

  const noMatch = () => {
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
  };

  const logOut = () => {
    // 清除token并跳转到登录页
    localStorage.removeItem('token');
    localStorage.removeItem('loginResult');
    history.replace('/sys/login');
    dispatch({
      type: 'user/save',
      payload: {
        currentUserData: {
          userInfo: {},
          doms: [],
          menus: [],
        }
      },
    })
  }

  const personCenter = () => {
    history.push('/userInfo')
  }

  const changeAccount = () => {
    history.push('/sys/accountSelect')
  }

  // 动态路由
  const flatMenus = useMemo(() => {
    return (menus?.length ? flatArr({ initArr: menus, childrenField: "routes" })?.map(item => ({
      ...item,
      icon: iconMap(item?.icon),
      level: item?.level - 0 + 2,
      hideInMenu: !!(item?.isHide == '1')
    })) : [])
  }, [menus])

  // 本地路由
  const menuRouters = routers.filter(item => item.routeType === '1').map(item => ({
    ...item,
    icon: iconMap(item?.meta?.icon),
    name: item?.meta?.title,
  }));

  // 默认路由
  const defaultMenuRouters = menuRouters.filter((item: any) => (item?.authorize))

  const menuData = isLocalMenus ? menuRouters : [...defaultMenuRouters, ...flatMenus]

  const menuProps = useMemo(() => {
    return convertData({ initArr: menuData });
  }, [flatMenus, routers])

  const authorized = useMemo(() => {
    return isLocalMenus ? true : (!!([...defaultMenuRouters, ...flatMenus]?.find(item => item?.path === location.pathname)))
  }, [flatMenus, location.pathname]);

  useEffect(() => {
    const menuData = flatMenus?.filter(item => item?.menuType === "2")?.sort((a, b) => a?.level - b?.level) ?? [];

    // 默认跳转至第一个 menuType=2 的路径
    const JumpDefaultPath = () => {
      for (const item of menuData) {
        const { menuType, path, isHide } = item;
        if ((menuType === "2") && (isHide == '0')) {

          history.push(path);
          break;
        }
      }
    };

    if (location.pathname === '/') {
      history.push('/introduction');
      // JumpDefaultPath();
    }

    setPathname(location.pathname);
  }, [location.pathname, flatMenus]);

  if (typeof document === 'undefined') {
    return <div />;
  }
  return (
    <div
      id="pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('pro-layout') || document.body;
          }}
        >
          <ProLayout
            logo={<img style={{ borderRadius: "100%" }} src="https://lbf1314.github.io/aniyajs-doc/img/logo.jpg" />}
            title="AniyaJs"
            prefixCls="my-prefix"
            location={{
              pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src: userInfo?.avatar ? <Avatar size={64} src={userInfo?.avatar} /> : <Avatar size="small" icon={<UserOutlined />} />,
              size: 'small',
              title: userInfo?.nickname,
              render: (_, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        loginResult?.length ? {
                          key: 'change-account',
                          icon: iconMap('ChangeAccountSvg_Custom'),
                          label: '切换账号',
                          onClick: changeAccount,
                        } : null,
                        {
                          key: 'person-center',
                          icon: iconMap('UserOutlined'),
                          label: '个人中心',
                          onClick: personCenter,
                        },
                        {
                          key: 'logout',
                          icon: iconMap('LogoutOutlined'),
                          label: '退出登录',
                          onClick: logOut,
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              if (typeof window === 'undefined') return [];
              return [
                iconMap('GithubFilled', {
                  key: 'github',
                  onClick: () => window.open('https://gitee.com/liu-bingfang', '_blank'),
                })
              ];
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              );
              if (typeof window === 'undefined') return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return (
                <>
                  {defaultDom}
                </>
              );
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2025 Made with love</div>
                  <div>by AniyaJs</div>
                </div>
              );
            }}
            onMenuHeaderClick={() => history.push('/')}
            menuItemRender={(item, dom) => {
              return (
                <div
                  onClick={() => {
                    const pathname = item.path || '/';
                    const directorys = menuProps?.find(item => item.path === pathname)

                    if (directorys?.routes?.length) {
                      history.push(directorys?.routes?.[0]?.path || "/")
                      setPathname(directorys?.routes?.[0]?.path || '/');
                      return;
                    }

                    history.push(item.path || "/")
                    setPathname(item.path || '/');
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {dom}
                  </div>
                </div>
              )
            }}
            {...(menuProps?.length ? { route: { path: '/', routes: menuProps } } : { path: '/', routes: [] })}
            {...(showHeaderRender ? {} : { headerRender: false })}
            {...(showMenuRender ? {} : { menuRender: false })}
            {...settings}
          >
            <PageContainer
              {...(showBreadcrumbRender ? {} : { breadcrumb: undefined })}
              breadcrumbRender={(_, defaultDom) => {
                // @ts-ignore
                const newItems = defaultDom?.props?.items?.map(item => {
                  const curMenuInfo = menuData?.find(item1 => item?.linkPath === item1?.path)
                  return ({
                    href: item?.linkPath,
                    title: (
                      <>
                        {curMenuInfo?.icon}
                        <span>{item?.title}</span>
                      </>
                    ),
                  })
                })

                return (
                  <Breadcrumb
                    // @ts-ignore
                    className={defaultDom?.props?.className}
                    items={newItems}
                  />
                );
              }}
              title={false}
              token={{
                paddingInlinePageContainerContent: 20,
                paddingBlockPageContainerContent: 12,
              }}
            >
              <ProCard
                style={{
                  minHeight: 650,
                  width: '100%',
                }}
              >
                <Authorized authority={authorized} noMatch={noMatch()}>
                  {children}
                </Authorized>
              </ProCard>
            </PageContainer>
            <SettingDrawer
              pathname={pathname}
              enableDarkTheme
              getContainer={(e: any) => {
                if (typeof window === 'undefined') return e;
                return document.getElementById('pro-layout');
              }}
              settings={{
                ...(showHeaderRender ? {} : { headerRender: false }),
                ...(showMenuRender ? {} : { menuRender: false }),
                ...settings
              }}
              onSettingChange={(changeSetting) => {
                dispatch({
                  type: 'settings/changeSetting',
                  payload: {
                    ...changeSetting,
                  },
                });
              }}
              disableUrlParams={true}
            />
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};