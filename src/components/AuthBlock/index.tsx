import defaultSettings from 'config/defaultSettings';
import React from 'react';
import { useSelector } from '@aniyajs/plugin-tooltik';

export interface AuthBlockPropsType {
  children?: React.ReactNode | undefined;
  authority: string;
}

const { isLocalMenus } = defaultSettings;

const AuthBlock: React.FC<AuthBlockPropsType> = ({ children, authority }: AuthBlockPropsType) => {
  const { user: {
    currentUserData
  } } = useSelector((state: RootState) => state)

  const { doms = [] } = currentUserData;

  if (isLocalMenus) {
    return <>{children}</>;
  }

  const content = doms.findIndex((item) => item.permission === authority) !== -1 ? children : null;
  return <>{content}</>;
};

export default AuthBlock;
