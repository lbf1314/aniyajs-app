import React from 'react';
import * as Icons from '@ant-design/icons';
import Icon from '@ant-design/icons';
import * as CustomerSvg from '@/utils/svgIcon';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
export const iconMap = (iconStr?: string, props?: AntdIconProps) => {
  if (iconStr?.endsWith('_Custom')) {
    // @ts-ignore
    return <Icon component={CustomerSvg[iconStr]} {...props} />
  }

  if (!iconStr) return null;

  // @ts-ignore
  const IconWidget = Icons[iconStr]

  return <IconWidget {...props} />
};
