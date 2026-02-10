import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, AuthContextType } from '@/types';
import { toast } from 'sonner';

// backend API URL
import api from "@/api/axios";


// Mock users for demonstration
// const MOCK_USERS: Record<string, { password: string; user: User }> = {
//   'principal@jnv.edu': {
//     password: 'principal123',
//     user: {
//       id: '1',
//       email: 'principal@jnv.edu',
//       name: 'Dr. Rajesh Kumar',
//       role: 'principal',
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=principal',
//     },
//   },
//   'housemaster@jnv.edu': {
//     password: 'housemaster123',
//     user: {
//       id: '2',
//       email: 'housemaster@jnv.edu',
//       name: 'Mr. Suresh Patel',
//       role: 'housemaster',
//       house: 'Shivaji House',
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=housemaster',
//     },
//   },
//   'teacher@jnv.edu': {
//     password: 'teacher123',
//     user: {
//       id: '3',
//       email: 'teacher@jnv.edu',
//       name: 'Mrs. Priya Sharma',
//       role: 'teacher',
//       subject: 'Mathematics',
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
//     },
//   },
//   'parent@jnv.edu': {
//     password: 'parent123',
//     user: {
//       id: '4',
//       email: 'parent@jnv.edu',
//       name: 'Mr. Amit Singh',
//       role: 'parent',
//       childId: 'S001',
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent',
//     },
//   },
// };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('jnv_token');
    const storedUser = localStorage.getItem('jnv_user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('jnv_token');
        localStorage.removeItem('jnv_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // send credentials to backend API
      const res = await api.post("/auth/login/", {
        email,
        password,
      });

      // backend returns access token and user info
      const { access, user:backenduser } = res.data;

      // save token
      localStorage.setItem('jnv_token', access);

      // save user info
      localStorage.setItem('jnv_user', JSON.stringify(backenduser));

      // update state
      setUser(backenduser);

      toast.success(`Welcome ${backenduser.name}`);
    } catch (error: any) {
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  // const logout = () => {
  //   localStorage.removeItem('jnv_token');
  //   localStorage.removeItem('jnv_user');
  //   setUser(null);
  //   toast.success('Logged out successfully');
  // };
  const logout = () => {
  localStorage.clear();
  setUser(null);

  window.location.href = "/login";
};


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
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
