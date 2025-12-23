import type { Settings as ProSettings } from '@ant-design/pro-layout';

export type DefaultSettings = ProSettings & {
  debugLocal: boolean;
  debugLocalDomain: string;
  isLocalMenus: boolean;

  showHeaderRender: boolean;
  showMenuRender: boolean;
  showBreadcrumbRender: boolean;
};

const defaultSettings = {
  fixSiderbar: true,
  layout: "mix",
  splitMenus: true,
  navTheme: "light",
  contentWidth: "Fluid",
  colorPrimary: "#1677FF",

  // 展示头部
  showHeaderRender: true,
  // 展示菜单
  showMenuRender: true,
  // 展示面包屑
  showBreadcrumbRender: true,

  // 本地调试
  debugLocal: false,
  debugLocalDomain: 'http://localhost:9994',
  // 本地菜单
  isLocalMenus: false,
} as DefaultSettings;

export default defaultSettings;