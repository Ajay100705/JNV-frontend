import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { cn } from '@/lib/utils';
import { Outlet } from "react-router-dom";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <TopNavbar isCollapsed={isCollapsed} />
      
      <main
        className={cn(
          'transition-all duration-300 pt-20 pb-8 px-6',
          isCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
