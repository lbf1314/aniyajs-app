import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@aniyajs/plugin-tooltik'
import { Navigate } from '@aniyajs/plugin-router'
import PageLoading from '@/components/PageLoading';
import { getUserInfoAsync } from '@/models/user';

export interface SecurityLayoutProps {
  children?: React.ReactNode;
}

export default ({ children }: SecurityLayoutProps): React.ReactNode => {
  const dispatch = useDispatch()
  const [isReady, setIsReady] = useState<boolean>(false)
  const state = useSelector((state: RootState) => state?.user)

  const { currentUserData, loading } = state
  const isLogin = !!currentUserData?.userInfo?.id;

  useEffect(() => {
    setIsReady(true)
    dispatch((getUserInfoAsync as any)())
  }, [])

  if (!isReady || (!isLogin && loading)) {
    return <PageLoading />
  }

  if (
    !isLogin &&
    window.location.pathname !== '/sys/login' &&
    window.location.pathname !== '/sys/register'
  ) {
    return <Navigate to="/sys/login" replace />
  }

  return <>{children}</>
};