import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface GuestRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
  redirectTo?: string;
}

const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  isAuthenticated,
  redirectTo = '/dashboard',
}) => {
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestRoute;
