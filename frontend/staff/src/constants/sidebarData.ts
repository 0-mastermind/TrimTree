import {  Home, Settings, BarChart3, LogOut, User, Plane } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
}

export const sidebarData: SidebarItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    id: 'home',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'leaves',
    label: 'Leaves',
    icon: Plane,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
  }
];