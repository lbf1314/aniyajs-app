import { AniyajsRouterType } from "@aniyajs/plugin-router";

export default [
  {
    path: '/',
    redirect: '/introduction',
  },
  // 个人中心
  {
    name: "userInfo",
    // 页面显示
    meta: {
      title: "个人中心", // 页面名称
    },
    path: "/userInfo",
    component: "./userInfo",
    routeType: "1",
    hideInMenu: true,
    authorize: true,
  },
  // 修改密码
  {
    name: "changePassword",
    // 页面显示
    meta: {
      title: "修改密码", // 页面名称
    },
    path: "/changePassword",
    component: "./sys/changePassword",
    routeType: "1",
    hideInMenu: true,
    authorize: true,
  },
  // 邮箱换绑
  {
    name: "changeEmail",
    // 页面显示
    meta: {
      title: "邮箱换绑", // 页面名称
    },
    path: "/changeEmail",
    component: "./sys/changeEmail",
    routeType: "1",
    hideInMenu: true,
    authorize: true,
  },
  // 网站介绍
  {
    name: "introduction",
    // 页面显示
    meta: {
      title: "网站介绍", // 页面名称
      icon: "SmileFilled", // 菜单图标
    },
    path: "/introduction",
    component: "./introduction",
    routeType: "1",
    authorize: true,
  },
  // 权限页
  {
    name: "permission",
    meta: {
      title: "权限页",
      icon: "PermissionSvg_Custom",
    },
    path: "/permission",
    routeType: "1",
    routes: [
      {
        path: '/permission',
        redirect: '/permission/accountManagement',
      },
      {
        name: "accountManagement",
        meta: {
          title: "账号管理",
          icon: "AccountSvg_Custom",
        },
        path: "/permission/accountManagement",
        component: "./permission/accountManagement",
        routeType: "1"
      },
      {
        name: "roleManagement",
        meta: {
          title: "角色管理",
          icon: "RoleSvg_Custom",
        },
        path: "/permission/roleManagement",
        component: "./permission/roleManagement",
        routeType: "1"
      },
      {
        name: "menuManagement",
        meta: {
          title: "菜单管理",
          icon: "MenuSvg_Custom",
        },
        path: "/permission/menuManagement",
        component: "./permission/menuManagement",
        routeType: "1"
      }
    ]
  },
  // 业务管理页
  {
    name: "business",
    meta: {
      title: "业务管理页",
      icon: "BusinessSvg_Custom",
    },
    path: "/business",
    routeType: "1",
    routes: [
      {
        path: '/business',
        redirect: '/business/happyHodgepodge/wallpaper',
      },
      {
        name: "happyHodgepodge",
        meta: {
          title: "快乐大杂烩",
          icon: "HappySvg_Custom",
        },
        path: "/business/happyHodgepodge",
        routeType: "1",
        routes: [
          {
            path: '/business/happyHodgepodge',
            redirect: '/business/happyHodgepodge/wallpaper',
          },
          {
            name: "wallpaper",
            meta: {
              title: "壁纸分享",
              icon: "WallpaperSvg_Custom",
            },
            path: "/business/happyHodgepodge/wallpaper",
            routeType: "1",
            routes: [
              {
                path: '/business/happyHodgepodge/wallpaper',
                redirect: '/business/happyHodgepodge/wallpaper/createWallpaper',
              },
              {
                name: "createWallpaper",
                meta: {
                  title: "创建壁纸集",
                },
                path: "/business/happyHodgepodge/wallpaper/createWallpaper",
                component: "./business/happyHodgepodge/wallpaper/createWallpaper",
                routeType: "1",
              },
              {
                name: "wallpaperList",
                meta: {
                  title: "壁纸列表",
                },
                path: "/business/happyHodgepodge/wallpaper/wallpaperList",
                routeType: "1",
                routes: [
                  {
                    name: "wallpaperListPage",
                    meta: {
                      title: "壁纸列表",
                    },
                    path: "/business/happyHodgepodge/wallpaper/wallpaperList",
                    component: "./business/happyHodgepodge/wallpaper/wallpaperList",
                    routeType: "1",
                    hideInMenu: true
                  },
                  {
                    name: "wallpaperDetailInfo",
                    meta: {
                      title: "壁纸详情",
                    },
                    path: "/business/happyHodgepodge/wallpaper/wallpaperList/detailInfo",
                    component: "./business/happyHodgepodge/wallpaper/createWallpaper",
                    routeType: "1",
                    hideInMenu: true
                  },
                ]
              },
              {
                name: "wallpaperAudit",
                meta: {
                  title: "壁纸审核列表",
                },
                path: "/business/happyHodgepodge/wallpaper/wallpaperAudit",
                routeType: "1",
                routes: [
                  {
                    name: "wallpaperAuditPage",
                    meta: {
                      title: "壁纸审核列表",
                    },
                    path: "/business/happyHodgepodge/wallpaper/wallpaperAudit",
                    component: "./business/happyHodgepodge/wallpaper/wallpaperAudit",
                    routeType: "1",
                    hideInMenu: true
                  },
                  {
                    name: "wallpaperAuditDetailInfo",
                    meta: {
                      title: "壁纸审核详情",
                    },
                    path: "/business/happyHodgepodge/wallpaper/wallpaperAudit/detailInfo",
                    component: "./business/happyHodgepodge/wallpaper/createWallpaper",
                    routeType: "1",
                    hideInMenu: true
                  },
                ]
              }
            ]
          },
          {
            name: "clothes",
            meta: {
              title: "穿搭分享",
              icon: "ClothesSvg_Custom",
            },
            path: "/business/happyHodgepodge/clothes",
            component: "./business/happyHodgepodge/clothes",
            routeType: "1"
          },
        ]
      }
    ]
  }
] as AniyajsRouterType[]