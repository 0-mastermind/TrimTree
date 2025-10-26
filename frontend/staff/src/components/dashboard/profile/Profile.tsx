import React, { useEffect, useMemo } from 'react';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Shield,
  Building2,
  UserCircle,
  Users,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import Loader from '@/components/common/Loader';
import { useAppDispatch } from '@/store/hook';
import { getProfile } from '@/api/auth';

const InitialAvatar: React.FC<{ name: string; size?: number }> = React.memo(({ name, size = 96 }) => {
  const initials = useMemo(() =>
    name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2), [name]
  );
  return (
    <div
      className="bg-emerald-800 flex items-center justify-center text-white font-semibold rounded-full ring-4 ring-white shadow-lg"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
});

const ProfileAvatar: React.FC<{ src?: string; name: string; size?: number; className?: string }> = ({ 
  src, 
  name, 
  size = 96, 
  className = "" 
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ring-4 ring-white shadow-lg ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }
  return <InitialAvatar name={name} size={size} />;
};

const InfoCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  className?: string;
}> = ({ icon, label, value, className = "" }) => (
  <div className={`group bg-white hover:bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm ${className}`}>
    <div className="flex items-start space-x-3">
      <div className="text-gray-400 group-hover:text-indigo-500 transition-colors duration-200 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
        <p className="text-sm text-gray-900 font-medium break-words leading-relaxed">{value}</p>
      </div>
    </div>
  </div>
);

const SectionCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="p-6 pb-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <div className="text-indigo-600 mr-3 bg-indigo-50 p-2 rounded-lg">{icon}</div>
        {title}
      </h2>
    </div>
    <div className="px-6 pb-6">
      {children}
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getProfile());
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const { user, staff } = useSelector((state: RootState) => state.auth);

  if (loading || !user || !staff) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
              <div className="flex-shrink-0 mb-6 sm:mb-0">
                <ProfileAvatar
                  src={user.image?.url}
                  name={user.name}
                  size={120}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">@{user.username}</p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Shield className="w-4 h-4 mr-2" />
                    {user.role}
                  </span>
                  {staff.designation && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {staff.designation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Main Section */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <SectionCard
              title="Personal Information"
              icon={<UserCircle className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<User className="w-5 h-5" />}
                  label="Full Name"
                  value={user.name}
                />
                <InfoCard
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  value={user.email || 'Not provided'}
                />
                <InfoCard
                  icon={<Shield className="w-5 h-5" />}
                  label="Role"
                  value={user.role}
                />
                <InfoCard
                  icon={<User className="w-5 h-5" />}
                  label="Username"
                  value={user.username}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Work Information"
              icon={<Briefcase className="w-5 h-5" />}
            >
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <ProfileAvatar
                        src={user?.branch?.image?.url}
                        name={user.branch.name}
                        size={64}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
                        {user.branch.name}
                      </h3>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{user.branch.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {staff.designation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={<Briefcase className="w-5 h-5" />}
                      label="Designation"
                      value={staff.designation}
                    />
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Right/Sidebar Section */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SectionCard
              title="Reporting Manager"
              icon={<Users className="w-5 h-5" />}
              className="h-fit"
            >
              <div className="space-y-4">
                <div className="text-center pb-4">
                  <ProfileAvatar
                    src={staff.manager.image?.url}
                    name={staff.manager.name}
                    size={80}
                    className="mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{staff.manager.name}</h3>
                </div>
                
                {staff.manager.email && (
                  <div className="pt-4 border-t border-gray-100">
                    <InfoCard
                      icon={<Mail className="w-4 h-4" />}
                      label="Email"
                      value={staff.manager.email}
                    />
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;