import { useState } from 'react';
import Layout from '@/components/common/Layout';
import Home from '@/components/dashboard/home/home';
import StaffAnalytics from '@/components/dashboard/analytics/Analytics';


// Example tab components
const Profile = () => <div>Profile content goes here</div>;
const Settings = () => <div>Settings content goes here</div>;

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('home');

  let content;
  switch (activeItem) { 
    case 'home':
      content = <Home />;
      break;
    case 'settings':
      content = <Settings />;
      break;
    case 'analytics':
      content = <StaffAnalytics />;
      break;
    case 'profile':
      content = <Profile />;
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