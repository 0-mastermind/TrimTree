import {  Home, Settings, BarChart3, Bell, LogOut } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
}

export const sidebarData: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/home'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/notifications'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    path: '/logout'
  }
];