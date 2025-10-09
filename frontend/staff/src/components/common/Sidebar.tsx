import React from 'react';
import { Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { sidebarData, type SidebarItem } from '../../constants/sidebarData';
import { useAppDispatch } from '@/store/hook';
import { logout } from '@/api/auth';

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const dispatch = useAppDispatch();

  const handleClick = (itemId: string) => {
    onItemClick(itemId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);
  const toggleExpansion = () => setIsExpanded(o => !o);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Tablet overlay when expanded */}
      {isExpanded && (
        <div
          className="hidden md:block lg:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-screen bg-gray-900 flex flex-col text-white transition-all duration-300 z-40 
          
          ${isMobileMenuOpen 
            ? 'fixed top-0 left-0 w-64' 
            : 'fixed top-0 left-0 -translate-x-full md:translate-x-0'
          }
          
          ${isExpanded 
            ? 'md:fixed md:w-64 lg:sticky lg:w-64' 
            : 'md:sticky md:w-16 lg:sticky lg:w-16'
          }
          md:top-0
        `}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-700 flex items-center ${isMobileMenuOpen ? 'justify-center' : 'justify-between'} min-h-15`}>
          <h1 className={`
            text-2xl font-bold text-white truncate
            ${isMobileMenuOpen ? 'block' : 'hidden'}
            ${isExpanded ? 'md:block' : 'md:hidden'}
          `}>
            TrimTree
          </h1>
          
          {/* Toggle button for tablet and desktop */}
          <button
            onClick={toggleExpansion}
            className={`
              hidden md:flex items-center justify-center p-1 text-gray-400 hover:text-white cursor-pointer
              transition-colors duration-200 
              ${isExpanded ? 'md:block' : 'md:block'}
            `}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-2 flex-1">
          {sidebarData.map((item: SidebarItem) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            
            if (item.label === 'Logout') {
              return (
                <button
                  key={item.id}
                  onClick={handleLogout}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-200
                    text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer
                    ${!isMobileMenuOpen ? 'md:justify-center' : ''}
                    ${!isExpanded ? 'md:justify-center lg:justify-center' : 'md:justify-start lg:justify-start'}
                  `}
                  title={(!isMobileMenuOpen && !isExpanded) ? item.label : undefined}
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <span className={`
                    font-medium whitespace-nowrap
                    ${isMobileMenuOpen ? 'inline' : 'hidden'}
                    ${isExpanded ? 'md:inline' : 'md:hidden'}
                  `}>
                    {item.label}
                  </span>
                </button>
              );
            }

            // Normal navigation items
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-[#3D2A01] text-[#FFD60A] border-l-4 border-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }
                  ${!isMobileMenuOpen ? 'md:justify-center' : ''}
                  ${!isExpanded ? 'md:justify-center lg:justify-center' : 'md:justify-start lg:justify-start'}
                `}
                title={(!isMobileMenuOpen && !isExpanded) ? item.label : undefined}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                <span className={`
                  font-medium whitespace-nowrap
                  ${isMobileMenuOpen ? 'inline' : 'hidden'}
                  ${isExpanded ? 'md:inline' : 'md:hidden'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;