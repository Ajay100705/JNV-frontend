import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  LogOut,
  // Settings,
  User,
  ChevronDown,
  Mail,
  Calendar,
} from 'lucide-react';

interface TopNavbarProps {
  isCollapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'principal':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'housemaster':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'teacher':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'parent':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-300',
        isCollapsed ? 'left-20' : 'left-64'
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Side - Breadcrumb / Welcome */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back,{" "}
              <span className="text-blue-600">
                {user.first_name || user.email.split("@")[0] || "User"}
              </span>
              !
            </h2>

            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right Side - Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white animate-bounce">
              5
            </span>
          </Button>

          {/* Messages Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-gray-100 hidden sm:flex"
          >
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
              5
            </span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100"
              >
                <Avatar className="h-9 w-9 ring-2 ring-blue-500/30 ring-offset-2">
                  <AvatarImage
                    src={
                      user.profile?.photo
                        ? `http://127.0.0.1:8000${user.profile.photo}`
                        : undefined
                    }
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {(user.first_name?.[0] || "")}
                    {(user.last_name?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800">{user.first_name} {user.last_name}</p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-[10px] px-1.5 py-0 capitalize font-medium',
                      getRoleColor(user.role)
                    )}
                  >
                    {user.role}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">

              <DropdownMenuItem
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="cursor-pointer focus:bg-gray-100"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                onClick={() => navigate(`/${user.role}/profile`)}
              >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                
              </DropdownMenuItem>

              {/* <DropdownMenuItem asChild>
                <Link to={`/${user.role}/profile`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem> */}

              <DropdownMenuItem className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
