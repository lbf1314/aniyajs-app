import React from 'react';

export interface AuthorizedPropsType {
  authority: boolean;
  noMatch?: React.ReactNode;
  children?: React.ReactNode;
}

const Authorized: React.FC<AuthorizedPropsType> = ({ authority, noMatch, children }) => {
  if (!authority) {
    if (noMatch) {
      return <>{noMatch}</>;
    } else {
      return null;
    }
  }

  return <>{children}</>
};

export default Authorized;