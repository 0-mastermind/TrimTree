// src/router/ProtectedRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;      // the element to render if authenticated
  isAuthenticated: boolean;  // pass your auth state here
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
