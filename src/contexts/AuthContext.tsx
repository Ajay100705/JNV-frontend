import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, AuthContextType } from '@/types';
import { toast } from 'sonner';

// backend API URL
import api from "@/api/axios";




const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('jnv_token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get("/auth/me/")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.clear();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);

  
    
    try {
      // send credentials to backend API
      const res = await api.post("/auth/login/", {
        username,
        password,
      });

      // backend returns access token and user info
      const { access} = res.data;

      // save token
      localStorage.setItem('jnv_token', access);

      // fetch real user from backend
      const me = await api.get("/auth/me/");
      setUser(me.data);

      toast.success(`Welcome ${me.data.first_name}`);
    } catch (error: any) {
      toast.error('Invalid username or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

// clear token and user info on logout
  const logout = () => {
  localStorage.clear();
  setUser(null);
  window.location.href = "/login";
};

const refreshUser = async (): Promise<void> => {
    try {
      const res = await api.get("/auth/me/");
      setUser(res.data);
    } catch (error) {
      logout();
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'principal':
      return '/principal/dashboard';
    case 'housemaster':
      return '/housemaster/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'parent':
      return '/parent/dashboard';
    default:
      return '/login';
  }
};
