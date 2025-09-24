import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hook';
import { getProfile } from '@/api/auth';
import { appRoutes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import Loader from '@/components/common/Loader';

const AppRouter: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);

  const isAuthenticated = user ? true : false; 

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      await dispatch(getProfile());
      setLoading(false);
    };

    fetchProfile();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        {appRoutes.map(route => {
          const element = route.protected ? (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {route.element}
            </ProtectedRoute>
          ) : route.guest ? (
            <GuestRoute isAuthenticated={isAuthenticated}>
              {route.element}
            </GuestRoute>
          ) : (
            route.element
          );

          return <Route key={route.path} path={route.path} element={element} />;
        })}

        {/* Redirect unknown routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
