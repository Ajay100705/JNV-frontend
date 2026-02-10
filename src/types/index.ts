// User Roles
export type UserRole = 'principal' | 'housemaster' | 'teacher' | 'parent';

// User Interface
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar?: string;
  house?: string; // For house masters
  subject?: string; // For teachers
  childId?: string; // For parents
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Student Interface
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  house: string;
  class: string;
  section: string;
  attendance: number;
  parentId?: string;
}

// Teacher Interface
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  qualification: string;
}

// House Master Interface
export interface HouseMaster {
  id: string;
  name: string;
  email: string;
  house: string;
  phone: string;
}

// Parent Interface
export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  childName: string;
  childId: string;
}

// Attendance Interface
export interface Attendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

// Marks Interface
export interface Marks {
  studentId: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
}

// Message Interface
export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalHouses: number;
  houseWiseStudents?: { house: string; count: number }[];
  attendancePercentage?: number;
}

// Menu Item Interface
export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}
