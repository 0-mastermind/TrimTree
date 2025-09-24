import type { AppRoute } from '../types/type';
import LoginPage from '../pages/Login';
import DashboardPage from '@/pages/Dashboard';

export const appRoutes: AppRoute[] = [
  { path: '/login', element: <LoginPage />, guest: true },
  { path: '/dashboard', element: <DashboardPage /> , protected: true },
];

