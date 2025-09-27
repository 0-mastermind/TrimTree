import React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  activeItem: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeItem, onChange, children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed positioning */}
      <Sidebar activeItem={activeItem} onItemClick={onChange} />

      <main className="flex-1 overflow-y-auto">
        <div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;