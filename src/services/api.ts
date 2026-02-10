// Mock API service - no axios needed for demo
// In production, uncomment the axios imports and use real API calls

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.jnv.edu/v1';

// Create axios instance (commented for demo)
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// Request interceptor to attach JWT token (commented for demo)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('jnv_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for error handling (commented for demo)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('jnv_token');
//       localStorage.removeItem('jnv_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// Mock API functions for demonstration
export const mockApi = {
  // Dashboard stats
  getPrincipalStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        totalStudents: 480,
        totalTeachers: 32,
        totalParents: 450,
        totalHouses: 4,
        houseWiseStudents: [
          { house: 'Shivaji House', count: 120 },
          { house: 'Tagore House', count: 115 },
          { house: 'Ashoka House', count: 125 },
          { house: 'Raman House', count: 120 },
        ],
      },
    };
  },

  getHouseMasterStats: async (house: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        totalStudents: 120,
        attendancePercentage: 92,
        presentToday: 110,
        absentToday: 10,
        house,
      },
    };
  },

  getTeacherStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        totalStudents: 150,
        classesToday: 4,
        pendingAssignments: 8,
        attendancePercentage: 88,
      },
    };
  },

  getParentStats: async (_childId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        childName: 'Rahul Singh',
        rollNumber: 'S001',
        class: '10',
        section: 'A',
        attendancePercentage: 95,
        house: 'Shivaji House',
        recentMarks: [
          { subject: 'Mathematics', marks: 85, total: 100 },
          { subject: 'Science', marks: 78, total: 100 },
          { subject: 'English', marks: 92, total: 100 },
        ],
      },
    };
  },

  // CRUD Operations
  getTeachers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        { id: 'T001', name: 'Mrs. Priya Sharma', email: 'priya@jnv.edu', subject: 'Mathematics', phone: '9876543210', qualification: 'M.Sc. Mathematics' },
        { id: 'T002', name: 'Mr. Rajesh Verma', email: 'rajesh@jnv.edu', subject: 'Science', phone: '9876543211', qualification: 'M.Sc. Physics' },
        { id: 'T003', name: 'Mrs. Sunita Devi', email: 'sunita@jnv.edu', subject: 'English', phone: '9876543212', qualification: 'M.A. English' },
        { id: 'T004', name: 'Mr. Amit Kumar', email: 'amit@jnv.edu', subject: 'Hindi', phone: '9876543213', qualification: 'M.A. Hindi' },
      ],
    };
  },

  getHouseMasters: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        { id: 'H001', name: 'Mr. Suresh Patel', email: 'suresh@jnv.edu', house: 'Shivaji House', phone: '9876543220' },
        { id: 'H002', name: 'Mrs. Meena Gupta', email: 'meena@jnv.edu', house: 'Tagore House', phone: '9876543221' },
        { id: 'H003', name: 'Mr. Ramesh Yadav', email: 'ramesh@jnv.edu', house: 'Ashoka House', phone: '9876543222' },
        { id: 'H004', name: 'Mrs. Kavita Rao', email: 'kavita@jnv.edu', house: 'Raman House', phone: '9876543223' },
      ],
    };
  },

  getParents: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        { id: 'P001', name: 'Mr. Amit Singh', email: 'amit.parent@jnv.edu', phone: '9876543230', childName: 'Rahul Singh', childId: 'S001' },
        { id: 'P002', name: 'Mrs. Priya Patel', email: 'priya.parent@jnv.edu', phone: '9876543231', childName: 'Neha Patel', childId: 'S002' },
        { id: 'P003', name: 'Mr. Rajesh Kumar', email: 'rajesh.parent@jnv.edu', phone: '9876543232', childName: 'Amit Kumar', childId: 'S003' },
      ],
    };
  },

  getStudents: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        { id: 'S001', name: 'Rahul Singh', rollNumber: '101', house: 'Shivaji House', class: '10', section: 'A', attendance: 95 },
        { id: 'S002', name: 'Neha Patel', rollNumber: '102', house: 'Tagore House', class: '10', section: 'A', attendance: 92 },
        { id: 'S003', name: 'Amit Kumar', rollNumber: '103', house: 'Ashoka House', class: '9', section: 'B', attendance: 88 },
        { id: 'S004', name: 'Priya Sharma', rollNumber: '104', house: 'Raman House', class: '11', section: 'A', attendance: 96 },
        { id: 'S005', name: 'Rohit Verma', rollNumber: '105', house: 'Shivaji House', class: '10', section: 'B', attendance: 90 },
      ],
    };
  },

  getHouseStudents: async (house: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const allStudents = [
      { id: 'S001', name: 'Rahul Singh', rollNumber: '101', house: 'Shivaji House', class: '10', section: 'A', attendance: 95 },
      { id: 'S005', name: 'Rohit Verma', rollNumber: '105', house: 'Shivaji House', class: '10', section: 'B', attendance: 90 },
      { id: 'S006', name: 'Ankit Patel', rollNumber: '106', house: 'Shivaji House', class: '9', section: 'A', attendance: 87 },
    ];
    return {
      data: allStudents.filter(s => s.house === house),
    };
  },

  getChildDetails: async (_childId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        id: 'S001',
        name: 'Rahul Singh',
        rollNumber: '101',
        house: 'Shivaji House',
        class: '10',
        section: 'A',
        attendance: 95,
        subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'],
        recentAttendance: [
          { date: '2024-01-15', status: 'present' },
          { date: '2024-01-14', status: 'present' },
          { date: '2024-01-13', status: 'absent' },
          { date: '2024-01-12', status: 'present' },
          { date: '2024-01-11', status: 'present' },
        ],
      },
    };
  },
};
