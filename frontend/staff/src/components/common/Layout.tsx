import React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  activeItem: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeItem, onChange, children }) => {
  return (
    <div className="flex  h-screen">
      {/* Sidebar stays fixed */}
      <div className="h-full fixed">
        <Sidebar activeItem={activeItem} onItemClick={onChange} />
      </div>

      {/* Main content scrolls independently */}
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
