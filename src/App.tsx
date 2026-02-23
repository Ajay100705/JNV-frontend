import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth, getDashboardRoute } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Login } from '@/pages/Login';

// Principal Pages
import { PrincipalDashboard } from '@/pages/principal/Dashboard';
import { PrincipalTeachers } from '@/pages/principal/Teachers';
import { PrincipalHouseMasters } from '@/pages/principal/HouseMasters';
import { PrincipalParents } from '@/pages/principal/Parents';
import { PrincipalStudents } from '@/pages/principal/Students';
import { PrincipalProfile } from '@/pages/principal/Profile';

// House Master Pages
import { HouseMasterDashboard } from '@/pages/housemaster/Dashboard';
import { HouseMasterStudents } from '@/pages/housemaster/Students';
import { HouseMasterProfile } from '@/pages/housemaster/Profile';

// Teacher Pages
import { TeacherDashboard } from '@/pages/teacher/Dashboard';
import { TeacherStudents } from '@/pages/teacher/Students';
import { TeacherProfile } from '@/pages/teacher/Profile';
import  AddTeacher  from '@/pages/teacher/AddTeacher';

// Parent Pages
import { ParentDashboard } from '@/pages/parent/Dashboard';
import { ParentChild } from '@/pages/parent/Child';
import { ParentProfile } from '@/pages/parent/Profile';
import AddStudent from '@/pages/parent/AddStudent';

// Role-based redirect component
const RoleBasedRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardRoute(user!.role)} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'inherit',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root redirect based on role */}
          <Route path="/" element={<RoleBasedRedirect />} />


          {/* Principal Routes */}

          <Route
            path="/principal"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PrincipalDashboard />} />

            <Route path="dashboard" element={<PrincipalDashboard />} />
            
            <Route path="teachers" element={<PrincipalTeachers />} />
            <Route path="housemasters" element={<PrincipalHouseMasters />} />
            <Route path="parents" element={<PrincipalParents />} />
            <Route path="students" element={<PrincipalStudents />} />
            <Route path="profile" element={<PrincipalProfile />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="add-student" element={<AddStudent />} />
          </Route>



          {/* House Master Routes */}
          <Route
            path="/housemaster/dashboard"
            element={
              <ProtectedRoute allowedRoles={['housemaster']}>
                <HouseMasterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/housemaster/students"
            element={
              <ProtectedRoute allowedRoles={['housemaster']}>
                <HouseMasterStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/housemaster/profile"
            element={
              <ProtectedRoute allowedRoles={['housemaster']}>
                <HouseMasterProfile />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/profile"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentChild />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/profile"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentProfile />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
