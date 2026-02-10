import React from 'react';
import { Navigate, useLocation } from '@/mocks/react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleDashboardMap: Record<UserRole, string> = {
      principal: '/principal/dashboard',
      housemaster: '/housemaster/dashboard',
      teacher: '/teacher/dashboard',
      parent: '/parent/dashboard',
    };
    
    return <Navigate to={roleDashboardMap[user.role]} replace />;
  }

  return <>{children}</>;
};
