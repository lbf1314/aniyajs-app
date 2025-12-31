import { AniyajsRouterType } from "@aniyajs/plugin-router";

export const UserRouter: AniyajsRouterType[] = [
  {
    path: '/sys',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/sys', redirect: '/sys/login' },
      {
        name: 'login',
        path: '/sys/login',
        component: './sys/login',
      },
      {
        name: 'register',
        path: '/sys/register',
        component: './sys/register',
      },
      {
        name: 'emailLogin',
        path: '/sys/emailLogin',
        component: './sys/emailLogin',
      },
      {
        name: 'accountSelect',
        path: '/sys/accountSelect',
        component: './sys/accountSelect',
      },
      {
        component: './exception/404',
      },
    ],
  },
]

// 异常路由
export const ExceptionRouter: AniyajsRouterType[] = [
  {
    name: 'exception',
    path: '/exception',
    routes: [
      {
        name: '403',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        component: './exception/404',
      },
    ],
  },
];