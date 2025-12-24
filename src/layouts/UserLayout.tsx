import { Helmet, HelmetProvider } from 'react-helmet-async';
import React from 'react';
import styles from './userLayout.module.less';

export interface UserLayoutProps {
  children?: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const { children } = props;

  return (
    <HelmetProvider>
      <Helmet>
        <meta name="description" content="登录" />
      </Helmet>

      <div className={styles.userLayout}>
        <div className={styles.videoBackground}>
          <video
            src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
            autoPlay
            playsInline
            loop
            muted
            crossOrigin="anonymous"
          />
        </div>
        <div className={styles.container}>{children}</div>
      </div>
    </HelmetProvider>
  );
};

export default UserLayout;
