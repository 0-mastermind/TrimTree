import React from 'react';
import { Menu, X } from 'lucide-react';
import { sidebarData, type SidebarItem } from '../../constants/sidebarData';

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleClick = (itemId: string) => {
    onItemClick(itemId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - Fixed at top left */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay - Transparent */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-screen bg-gray-900 flex flex-col gap-4 text-white transition-transform duration-300
          md:w-64 md:relative md:translate-x-0 md:z-auto
          ${isMobileMenuOpen
            ? 'fixed left-0 top-0 w-64 translate-x-0 z-40'
            : 'fixed left-0 top-0 w-64 -translate-x-full md:translate-x-0'
          }
        `}
      >
        {/* TrimTree Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">
            TrimTree
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col">
          {sidebarData.map((item: SidebarItem) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`w-full px-4 flex items-center gap-3 py-3 text-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#3D2A01] text-[#FFD60A] border-l-4 border-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">
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