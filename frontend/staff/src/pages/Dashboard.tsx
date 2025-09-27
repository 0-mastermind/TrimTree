import { useState } from 'react';
import Layout from '@/components/common/Layout';
import Home from '@/components/dashboard/home/home';
import StaffAnalytics from '@/components/dashboard/analytics/Analytics';
import UserSettingsPage from '@/components/dashboard/setting/Setting';
import Loader from '@/components/common/Loader';
import ProfilePage from '@/components/dashboard/profile/Profile';
import LeaveApplication from '@/components/dashboard/leave/Leaves';


export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('home');

  let content;
  switch (activeItem) { 
    case 'profile':
      content = <ProfilePage />;
      break;
    case 'home':
      content = <Home />;
      break;
    case 'leaves':
      content = <LeaveApplication />;
      break;
    case 'settings':
      content = <UserSettingsPage />;
      break;
    case 'analytics':
      content = <StaffAnalytics />;
      break;
    case 'logout':
      content = <Loader />;
      break;
    default:
      content = <Home />;
  }

  return (
    <Layout activeItem={activeItem} onChange={setActiveItem}>
      {content}
    </Layout>
  );
}