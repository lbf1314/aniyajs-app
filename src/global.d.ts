// 全局变量
declare const API_DOMAIN: string;
declare const GLOBAL_VARIABLE: string;

//
type KeyValue = string | number;

// models
interface RootState {
  user: import('@/models/user').UserState;
  settings: import('config/defaultSettings').DefaultSettings;
}

declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg?component' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}