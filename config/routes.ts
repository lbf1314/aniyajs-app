// export default [
//   {
//     path: "", // 路由地址
//     component: "", // 页面组件地址
//     routes: [], // 配置子路由
//     redirect: "", // 路由跳转地址
//     title: "", // 页面路由标题
//     name: "", // 页面名字标识
//     routeType: "1", // 路由类型，1: 菜单路由，2: 非菜单路由
//   }
// ]
import { AniyajsRouterType } from '@aniyajs/plugin-router';
import { UserRouter, ExceptionRouter } from './baseRouter.config';
import BusinessRouterConfig from './businessRouter.config';

export default [
  // user
  ...UserRouter,
  // exception
  ...ExceptionRouter,
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          ...BusinessRouterConfig,
          {
            component: './exception/404',
          },
        ]
      },
      {
        component: './exception/404',
      },
    ],
  },
  {
    component: './exception/404',
  },
] as AniyajsRouterType[]
