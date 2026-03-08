import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
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
  ChevronDown,
  LogOut,
  ClipboardCheck,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserRole } from "@/types";

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
    { label: "Dashboard", path: "/principal/dashboard", icon: LayoutDashboard },

    { label: "Teachers", path: "/principal/teachers", icon: Users },
    { label: "Class Teachers", path: "/principal/class-teachers", icon: Users },

    { label: "Parents", path: "/principal/parents", icon: UserCircle },
    { label: "Students", path: "/principal/students", icon: GraduationCap },

    { label: "House Masters", path: "/principal/housemasters", icon: School },

    {label: "Timetable",path: "/principal/timetable-manager",icon: Calendar,},

    { label: "Exams", path: "/principal/create-exam", icon: ClipboardCheck },

    { label: "Subject Management", path: "/principal/subject-management", icon: BookOpen }, 

    { label: "Class Subjects", path: "/principal/class-subjects", icon: BookOpen },

    { label: "Exam Subjects", path: "/principal/exam-subjects", icon: FileText },
      
    // { label: "Profile", path: "/principal/profile", icon: Settings },
  ],

  teacher: [
    { label: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
    { label: "Total Students", path: "/teacher/total-students", icon: Users },
    { label: "Attendance", path: "/teacher/attendance", icon: ClipboardList },
  ],

  parent: [
    { label: "Dashboard", path: "/parent/dashboard", icon: LayoutDashboard },
    { label: "My Child", path: "/parent/child", icon: UserCircle },
    { label: "Attendance", path: "/parent/attendance", icon: Calendar },
    { label: "Messages", path: "/parent/messages", icon: MessageSquare },
    // { label: "Profile", path: "/parent/profile", icon: Settings },
  ],

  student: [
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "Attendance", path: "/student/attendance", icon: Calendar },
    { label: "Marks", path: "/student/marks", icon: ClipboardList },
    { label: "Profile", path: "/student/profile", icon: Settings },
  ],
};

const classMenu = [
  { label: "Class Students", path: "/teacher/students", icon: GraduationCap },
  { label: "Marks", path: "/teacher/marks-manager", icon: BookOpen },
];

const houseMenu = [
  { label: "House Dashboard", path: "/teacher/house-dashboard", icon: School },
  { label: "House Students", path: "/teacher/house-students", icon: Users },
  {
    label: "House Attendance",
    path: "/teacher/house-attendance",
    icon: Calendar,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isClassRoute =
    location.pathname.startsWith("/teacher/students") ||
    location.pathname.startsWith("/teacher/marksManager");

  const isHouseRoute = location.pathname.startsWith("/teacher/house");

  const [classOpen, setClassOpen] = useState(isClassRoute);
  const [houseOpen, setHouseOpen] = useState(isHouseRoute);

  if (!user) return null;

  const menuItems = [...roleMenuItems[user.role as UserRole]];

  const isClassTeacher =
    user.role === "teacher" && user.profile?.is_class_teacher;

  const isHouseMaster =
    user.role === "teacher" && user.profile?.is_house_master;

  const dashboardPath = `/${user.role}/dashboard`;

  const [logoError, setLogoError] = useState(false);

  const renderItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : "text-slate-300 hover:bg-slate-800 hover:text-white",
          isCollapsed && "justify-center px-2",
        )}
      >
        <Icon className="h-5 w-5" />

        {!isCollapsed && (
          <span className="font-medium whitespace-nowrap">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <Link
        to={dashboardPath}
        className="flex h-16 items-center border-b border-slate-700 px-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg overflow-hidden">
            {!logoError ? (
              <img
                src="/navodaya.jpeg"
                alt="logo"
                className="h-8 w-8 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <School className="h-6 w-6 text-blue-600" />
            )}
          </div>

          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                JNV School
              </h1>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          )}
        </div>
      </Link>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-blue-600 text-white"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <nav className="space-y-2">
          {/* Main Items */}
          {menuItems.map(renderItem)}

          {/* CLASS DROPDOWN */}
          {isClassTeacher && (
            <>
              <button
                onClick={() => setClassOpen(!classOpen)}
                className="w-full flex items-center justify-between px-3 py-3 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5" />
                  {!isCollapsed && <span>Class</span>}
                </div>
                {!isCollapsed &&
                  (classOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </button>

              {classOpen && (
                <div className="ml-6 space-y-1">
                  {classMenu.map(renderItem)}
                </div>
              )}
            </>
          )}

          {/* HOUSE DROPDOWN */}
          {isHouseMaster && (
            <>
              <button
                onClick={() => setHouseOpen(!houseOpen)}
                className="w-full flex items-center justify-between px-3 py-3 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5" />
                  {!isCollapsed && <span>House</span>}
                </div>
                {!isCollapsed &&
                  (houseOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </button>

              {houseOpen && (
                <div className="ml-6 space-y-1">
                  {houseMenu.map(renderItem)}
                </div>
              )}
            </>
          )}

          {renderItem({
            label: "Profile",
            path: `/${user.role}/profile`,
            icon: Settings,
          })}
        </nav>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="mt-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <p className="text-xs text-emerald-400 uppercase font-semibold">
              Logged in as
            </p>

            <p className="text-sm font-medium text-white mt-1">{user.role}</p>

            {user.role === "teacher" && (
              <>
                <p className="text-xs text-slate-400 mt-1">
                  Subject: {user.profile?.subject ?? "Not Assigned"}
                </p>

                {user.profile?.is_class_teacher && (
                  <p className="text-xs text-slate-400 mt-1">
                    Class Teacher: {user.profile.class_teacher_of}
                  </p>
                )}

                {user.profile?.is_house_master && (
                  <p className="text-xs text-slate-400 mt-1">
                    House Master: {user.profile.house_name ?? "Assigned"}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 w-full px-3">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};
