// ================= USER ROLES =================

export type UserRole = "principal" | "housemaster" | "teacher" | "parent" | "student";


// ================= BASE USER =================

interface BaseUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender?: string;
}


// ================= PROFILE TYPES =================

export interface PrincipalProfile {
  phone1?: string;
  phone2?: string;
  photo?: string;
  present_address?: string;
  permanent_address?: string;
  bio?: string;
  joining_date?: string;
}

export interface TeacherProfile {
  phone1?: string;
  phone2?: string;
  subject?: string;
  qualification?: string;
  experience_years?: number;
  date_of_joining?: string;
  present_address?: string;
  permanent_address?: string;
  photo?: string;
}

export interface ParentProfile {
  phone1?: string;
  phone2?: string;
  job?: string;
  photo?: string;
  present_address?: string;
  permanent_address?: string;
  children?: Child[];
}

export interface StudentProfile {
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
  gender?: string;

  admission_date?: string;
  date_of_birth?: string;
  photo?: string;

  classroom?: {
    id: number;
    class_name: string;
    section: string;
  };

  house?: {
    id: number;
    house_name: string;
    house_category: string;
  };

  parent?: {
    id: number;
    first_name?: string;
    last_name?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    job?: string;
    present_address?: string;
    permanent_address?: string;
    photo?: string;
  };
}


// ================= ROLE-BASED USER TYPES =================

export interface PrincipalUser extends BaseUser {
  role: "principal";
  profile: PrincipalProfile;
}

export interface TeacherUser extends BaseUser {
  role: "teacher";
  profile: TeacherProfile;
}

export interface ParentUser extends BaseUser {
  role: "parent";
  profile: ParentProfile;
}

export interface StudentUser extends BaseUser {
  role: "student";
  profile: StudentProfile;
}

export interface HouseMasterUser extends BaseUser {
  role: "housemaster";
  profile: TeacherProfile; // assuming housemaster is teacher-based
}


// ================= FINAL USER TYPE =================

export type User =
  | PrincipalUser
  | TeacherUser
  | ParentUser
  | StudentUser
  | HouseMasterUser;


// ================= AUTH CONTEXT =================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}


// ================= CHILD =================

export interface Child {
  id: number;
  first_name: string;
  last_name: string;
  admission_number: string;
  class_name?: string;
  section?: string;
  house_name?: string;
  house_category?: string;
  photo?: string;
}


// ================= TEACHER =================

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  gender?: string;
  phone1?: string;
  phone2?: string;
  subject?: string;
  qualification?: string;
  experience_years?: number;
  date_of_joining?: string;
  present_address?: string;
  permanent_address?: string;
  photo?: string;
}


// ================= HOUSE MASTER =================

export interface HouseMaster {
  id: number;
  teacher: number;
  house: number;

  teacher_detail: {
    first_name: string;
    last_name: string;
    email: string;
    photo?: string;
    phone1?: string;
    phone2?: string;
  };

  house_detail: {
    house_name: string;
    house_category: string;
  };

  is_house_master: boolean;
}


// ================= ATTENDANCE =================

export interface Attendance {
  student: number;
  date: string;
  status: "present" | "absent" | "leave";
}


// ================= MARKS =================

export interface Marks {
  student: number;
  subject: string;
  exam_type: string;
  marks: number;
  total_marks: number;
}


// ================= PRINCIPAL DASHBOARD STATS =================

export interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_housemasters: number;
  total_parents: number;
  houseWiseStudents: {
    house: string;
    category: string;
    student_count: number;
  }[];
}

// ================= STUDENT =================

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  admission_date?: string;
  date_of_birth?: string;
  gender?: string;
  email?: string;
  photo?: string;

  classroom?: {
    id: number;
    class_name: string;
    section: string;
  };

  house?: {
    id: number;
    house_name: string;
    house_category: string;
  };

  parent?: {
    id: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    job?: string;
    present_address?: string;
    permanent_address?: string;
    photo?: string;
    phone1?: string;
    phone2?: string;
  };
}

// ================= PARENT =================
export interface Parent {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone1?: string;
  phone2?: string;
  job?: string;
  photo?: string;
  present_address?: string;
  permanent_address?: string;
  children?: Child[];
}


// // User Roles
// export type UserRole = "principal" | "housemaster" | "teacher" | "parent";

// // ================= AUTH CONTEXT =================

// export interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
//   refreshUser: () => Promise<void>;
// }
// export interface PrincipalProfile {
//   phone1?: string;
//   phone2?: string;
//   photo?: string;
//   present_address?: string;
//   permanent_address?: string;
//   bio?: string;
//   joining_date?: string;
// }

// export interface TeacherProfile {
//   phone?: string;
//   subject?: string;
//   qualification?: string;
//   experience_years?: number;
//   date_of_joining?: string;
//   photo?: string;
// }

// export interface StudentProfile {
//   date_of_birth?: string;

// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   role: UserRole;
//   gender?: string;
//   profile?: PrincipalProfile | TeacherProfile | StudentProfile | null;
// }

// // ================= STUDENT =================

// export interface Student {
//   id: number;
//   admission_date?: string;

//   username?: string;
//   first_name: string;
//   last_name: string;
//   photo?: string;

//   date_of_birth?: string;
//   email?: string;
//   gender?: string;

//   classroom?: {
//     id: number;
//     class_name: string;
//     section: string;
//   };

//   house?: {
//     id: number;
//     house_name: string;
//     house_category: string;
//   };

//   parent?: {
//     id: number;
//     first_name?: string;
//     last_name?: string;
//     phone1?: string;
//     phone2?: string;
//     email?: string;
//     job?: string;
//     present_address?: string;
//     permanent_address?: string;
//     photo?: string;
//   };
// }

// // ================= TEACHER =================

// export interface Teacher {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email?: string;
//   gender?: string;
//   phone?: string;
//   subject?: string;
//   qualification?: string;
//   experience_years?: number;
//   date_of_joining?: string;
//   photo?: string;
// }

// // ================= HOUSE MASTER =================

// export interface HouseMaster {
//   id: number;
//   teacher: number;
//   house: number;

//   teacher_detail: {
    
//       first_name: string;
//       last_name: string;
//       email: string;
    
//     photo?: string;
//   };

//   house_detail: {
//     house_name: string;
//     house_category: string;
//   };

//   is_house_master: boolean;
// }
// // ================= CHILD =================
// export interface Child {
//   id: number;
//   first_name: string;
//   last_name: string;
//   admission_number: string;
//   class_name?: string;
//   section?: string;
//   house_name?: string;
//   house_category?: string;
//   photo?: string;
// }


// // ================= PARENT =================

// export interface Parent {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email?: string;
//   phone1?: string;
//   phone2?: string;
//   job?: string;
//   photo?: string;
//   present_address?: string;
//   permanent_address?: string;
//   children?: Child[];
// }

// // ================= ATTENDANCE =================

// export interface Attendance {
//   student: number;
//   date: string;
//   status: "present" | "absent" | "leave";
// }

// // ================= MARKS =================

// export interface Marks {
//   student: number;
//   subject: string;
//   exam_type: string;
//   marks: number;
//   total_marks: number;
// }

// // ================= PRINCIPAL DASHBOARD STATS =================

// export interface DashboardStats {
//   total_students: number;
//   total_teachers: number;
//   total_housemasters: number;
//   total_parents: number;
//   houseWiseStudents: {
//     house: string;
//     category: string;
//     student_count: number;
//   }[];
// }

