import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  School,
  UserCircle,
  GraduationCap,
  MessageSquare,
  Calendar,
  Settings,
  BookOpen,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserRole } from '@/types';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const roleMenuItems: Record<UserRole, MenuItem[]> = {
  principal: [
    { label: 'Dashboard', path: '/principal/dashboard', icon: LayoutDashboard },
    { label: 'Teachers', path: '/principal/teachers', icon: Users },
    { label: 'House Masters', path: '/principal/housemasters', icon: School },
    { label: 'Parents', path: '/principal/parents', icon: UserCircle },
    { label: 'Students', path: '/principal/students', icon: GraduationCap },
    { label: 'Profile', path: '/principal/profile', icon: Settings },
  ],
  housemaster: [
    { label: 'Dashboard', path: '/housemaster/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/housemaster/students', icon: GraduationCap },
    { label: 'Attendance', path: '/housemaster/attendance', icon: Calendar },
    { label: 'Profile', path: '/housemaster/profile', icon: Settings },
  ],
  teacher: [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/teacher/students', icon: GraduationCap },
    { label: 'Attendance', path: '/teacher/attendance', icon: ClipboardList },
    { label: 'Marks', path: '/teacher/marks', icon: BookOpen },
    { label: 'Profile', path: '/teacher/profile', icon: Settings },
  ],
  parent: [
    { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    { label: 'My Child', path: '/parent/child', icon: UserCircle },
    { label: 'Attendance', path: '/parent/attendance', icon: Calendar },
    { label: 'Messages', path: '/parent/messages', icon: MessageSquare },
    { label: 'Profile', path: '/parent/profile', icon: Settings },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItems = roleMenuItems[user.role];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center w-full')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
            <School className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                JNV School
              </h1>
              <p className="text-xs text-slate-400 whitespace-nowrap">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  isCollapsed && 'justify-center px-2'
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    !isCollapsed && 'group-hover:scale-110',
                    isActive && 'animate-pulse'
                  )}
                />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="mt-8 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-4">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Logged in as</p>
            <p className="text-sm font-medium text-white capitalize mt-1">{user.role}</p>
            {user.house && (
              <p className="text-xs text-slate-400 mt-1">{user.house}</p>
            )}
            {user.subject && (
              <p className="text-xs text-slate-400 mt-1">{user.subject}</p>
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};
