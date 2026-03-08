import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Spinner } from '@/components/ui/spinner';
import { Badge } from "@/components/ui/badge";
import type { ClassTeacherStudent } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  // GraduationCap,
  // TrendingUp,
  Calendar,
  FileText,
  Home,
  User,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
// import { set } from 'date-fns';
// import { se } from 'date-fns/locale';

const houseStyle = (house?: string) => {
  switch (house) {
    case "Shivalik":
      return "bg-red-100 text-red-600 border-red-200";
    case "Aravali":
      return "bg-blue-100 text-blue-600 border-blue-200";
    case "Nilgiri":
      return "bg-green-100 text-green-600 border-green-200";
    case "Udaygiri":
      return "bg-yellow-100 text-yellow-600 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export const TeacherStudents: React.FC = () => {
  const [students, setStudents] = useState<ClassTeacherStudent[]>([]);
  const [classroom, setClassroom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<ClassTeacherStudent | null>(null);
  const [isMarksDialogOpen, setIsMarksDialogOpen] = useState(false);
  const [isClassTeacher, setIsClassTeacher] = useState<boolean | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get dashboard info
        const dashboardRes = await api.get("/academic/teacher/dashboard/");

        const isClass = dashboardRes.data.is_class_teacher;
        setIsClassTeacher(isClass);

        if (!isClass) {
          setStudents([]);
          setClassroom(null);
          // setIsLoading(false);
          return;
        }

        // 2️⃣ If class teacher → fetch students
        const studentsRes = await api.get(
          "/academic/teacher/my-class/students/",
        );

        setStudents(studentsRes.data?.students || []);
        setClassroom(studentsRes.data?.classroom || null);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.admission_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : [];

  const getAttendanceBadgeColor = (percentage: number) => {
    if (percentage < 75) {
      return "bg-red-100 text-red-700 border-red-200";
    } else if (percentage < 85) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else {
      return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getAttendanceRowColor = (percentage: number) => {
    if (percentage < 75) {
      return "bg-red-50 border-l-4 border-red-400";
    } else if (percentage < 85) {
      return "bg-yellow-50 border-l-4 border-yellow-400";
    } else {
      return "bg-green-50 border-l-4 border-green-400";
    }
  };

  const openDetails = (student: ClassTeacherStudent) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const openAttendance = async (student: ClassTeacherStudent) => {
    try {
      const res = await api.get(
        `/academic/teacher/student-subject-attendance/${student.id}/`,
      );

      setAttendanceData(res.data);
      setSelectedStudent(student);
      setIsAttendanceOpen(true);
    } catch {
      toast.error("Failed to load attendance");
    }
  };

  const openMarksDialog = (student: ClassTeacherStudent) => {
    setSelectedStudent(student);
    setIsMarksDialogOpen(true);
  };

  if (!isLoading && isClassTeacher === false) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 text-lg">
          Only class teachers can access this page.
        </p>
      </div>
    );
  }

  console.log("Students state:", students);
  console.log("Filtered students:", filteredStudents);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Students Class {classroom}
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage your class students
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search students by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">Photo</TableHead>
                  <TableHead className="text-center">Student Name</TableHead>
                  <TableHead className="text-center">House</TableHead>
                  <TableHead className="text-center">
                    Admission Number
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.photo ? (
                        <img
                          src={`http://127.0.0.1:8000${student.photo}`}
                          alt="Student"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Roll: {student.admission_number}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${houseStyle(student.house_name)} px-3 py-1 rounded-full`}
                      >
                        <Home size={12} className="mr-1" />
                        {student.house_name} - {student.house_category}
                      </Badge>
                    </TableCell>

                    <TableCell>{student.admission_number}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetails(student)}
                        >
                          Details
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openAttendance(student)}
                        >
                          <Calendar className="w-3 h-3" />
                          Attendance
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openMarksDialog(student)}
                        >
                          <FileText className="w-3 h-3" />
                          Marks
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Marks Dialog */}
      <Dialog open={isMarksDialogOpen} onOpenChange={setIsMarksDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enter Marks - {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Type</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option>Unit Test 1</option>
                  <option>Unit Test 2</option>
                  <option>Mid Term</option>
                  <option>Final Exam</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input defaultValue="Mathematics" disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Marks Obtained</label>
                <Input type="number" placeholder="Enter marks" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Marks</label>
                <Input type="number" defaultValue="100" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Remarks</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                placeholder="Add remarks..."
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast.success("Marks saved successfully");
                setIsMarksDialogOpen(false);
              }}
            >
              Save Marks
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Attendance - {selectedStudent?.name}</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Total Classes</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Leave</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {attendanceData.map((a, i) => (
                <TableRow
                  key={i}
                  className={`${getAttendanceRowColor(a.percentage)} hover:opacity-90 transition-colors`}
                >
                  <TableCell>{a.subject}</TableCell>

                  <TableCell>{a.total}</TableCell>

                  <TableCell className="text-600 font-medium">
                    {a.present}
                  </TableCell>

                  <TableCell className="text-600 font-medium">
                    {a.absent}
                  </TableCell>

                  <TableCell className="text-600 font-medium">
                    {a.leave}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getAttendanceBadgeColor(a.percentage)} px-3 py-1`}
                    >
                      {a.percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedStudent(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Student & Parent Profile
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* STUDENT HEADER BAR */}
              <div className="bg-gradient-to-r from-slate-500 to-blue-500 text-white rounded-xl p-5 shadow-md flex items-center gap-5">
                {/* Student Photo */}
                {selectedStudent.photo ? (
                  <img
                    src={
                      selectedStudent.photo.startsWith("http")
                        ? selectedStudent.photo
                        : `http://127.0.0.1:8000${selectedStudent.photo}`
                    }
                    alt="Student"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600 shadow">
                    {selectedStudent.name?.[0]}
                  </div>
                )}

                {/* Header Info */}
                <div>
                  <p className="text-2xl font-bold">{selectedStudent.name}</p>

                  <p className="text-sm opacity-90">
                    {selectedStudent.admission_number}
                  </p>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge className="bg-white/20 text-white border-white/40">
                      {selectedStudent.gender}
                    </Badge>

                    <Badge className="bg-white/20 text-white border-white/40">
                      {selectedStudent.house_name} -{" "}
                      {selectedStudent.house_category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* STUDENT DETAILS */}
              <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">
                  Student Information
                </h3>

                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium">Name :</span>{" "}
                    {selectedStudent.name}
                  </p>

                  <p>
                    <span className="font-medium">Admission No:</span>{" "}
                    {selectedStudent.admission_number}
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-medium">House :</span>

                    <Badge
                      variant="outline"
                      className={`${houseStyle(selectedStudent.house_name)} px-3 py-1 rounded-full`}
                    >
                      {selectedStudent.house_name} -{" "}
                      {selectedStudent.house_category}
                    </Badge>
                  </p>

                  <p>
                    <span className="font-medium">Class:</span>{" "}
                    {selectedStudent.classroom}
                  </p>

                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {selectedStudent.gender?.charAt(0).toUpperCase() + selectedStudent.gender?.slice(1)}
                  </p>

                  {/* Attendance */}
                  {/* <div className="flex items-center gap-2">
              <span className="font-medium">Attendance:</span>
      
              <Badge className={attendanceColor(selectedStudent.attendance_percentage)}>
                {selectedStudent.present}/{selectedStudent.total_classes} ({selectedStudent.attendance_percentage}%)
              </Badge>
            </div> */}

                  {/* <div className="flex gap-2 flex-wrap">
      
              <Badge className="bg-green-100 text-green-700">
                Present: {selectedStudent.present}
              </Badge>
      
              <Badge className="bg-red-100 text-red-700">
                Absent: {selectedStudent.absent}
              </Badge>
      
              <Badge className="bg-yellow-100 text-yellow-700">
                Leave: {selectedStudent.leave}
              </Badge>
      
            </div> */}
                </div>
              </div>

              {/* PARENT SECTION */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Parent Information
                </h3>

                <div className="flex items-start gap-5">
                  {/* Parent Photo */}
                  {selectedStudent.parent_photo ? (
                    <img
                      src={
                        selectedStudent.parent_photo.startsWith("http")
                          ? selectedStudent.parent_photo
                          : `http://127.0.0.1:8000${selectedStudent.parent_photo}`
                      }
                      alt="Parent"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 shadow-sm border">
                      {selectedStudent.parent_name?.[0]}
                    </div>
                  )}

                  {/* Parent Details */}
                  <div className="space-y-2 text-sm">
                    <p className="text-lg font-semibold">
                      {selectedStudent.parent_name? selectedStudent.parent_name.split(" ")
                      .map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "-"}
                    </p>

                    <p>
                      <span className="font-medium">Phone 1:</span>{" "}
                      {selectedStudent.parent_phone1 || "-"}
                    </p>

                    <p>
                      <span className="font-medium">Phone 2:</span>{" "}
                      {selectedStudent.parent_phone2 || "-"}
                    </p>

                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedStudent.parent_email || "-"}
                    </p>

                    <p>
                      <span className="font-medium">Occupation:</span>{" "}
                      {selectedStudent.parent_job? selectedStudent.parent_job.split(" ")
                      .map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "-"}
                    </p>
                  </div>
                </div>

                {/* ADDRESS CARDS */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-medium text-gray-700 mb-1">
                      Present Address
                    </p>
                    <p>{selectedStudent.parent_present_address || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-medium text-gray-700 mb-1">
                      Permanent Address
                    </p>
                    <p>{selectedStudent.parent_permanent_address || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
