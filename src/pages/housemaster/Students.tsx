import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

import { Search, Home } from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";

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

export const HouseMasterStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const classes = [
  "all",
  ...Array.from(
    new Set(
      students
        .map((s) => `${s.class}-${s.section}`)
        .filter(Boolean)
    )
  ),
];


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/houses/house-students/");
        setStudents(res.data);
      } catch (error) {
        toast.error("Failed to load house students");
      }
    };

    fetchStudents();
  }, []);
  

  const filteredStudents = students.filter((student) => {
  const query = searchQuery.toLowerCase();

  const studentClass = `${student.class}-${student.section}`;

  const matchName = student.name?.toLowerCase().includes(query);

  const matchClass =
    selectedClass === "all" || studentClass === selectedClass;

  return matchName && matchClass;
});

  const openDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">House Students</h1>
        <p className="text-gray-500">View students from your house</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
  <CardContent className="pt-6">
    <div className="flex flex-col md:flex-row gap-4">

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Class Dropdown */}
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
      >
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls === "all" ? "All Classes" : cls}
          </option>
        ))}
      </select>

    </div>
  </CardContent>
</Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.photo ? (
                      <img
                        src={
                          student.photo.startsWith("http")
                            ? student.photo
                            : `http://127.0.0.1:8000${student.photo}`
                        }
                        alt="Student"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {student.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        {student.rollNumber}
                      </p>
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

                  <TableCell>
                    {student.class}-{student.section}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        {student.attendance.present} /{" "}
                        {student.attendance.total}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        {student.attendance.leave}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetails(student)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogTitle>Student Details</DialogTitle>
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
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                    {selectedStudent.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                {/* Header Info */}
                <div>
                  <p className="text-2xl font-bold">
                    {selectedStudent.name
                      ? selectedStudent.name
                          .split(" ")
                          .map(
                            (word: string) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")
                      : "-"}
                  </p>

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
                    {selectedStudent.name
                      ? selectedStudent.name
                          .split(" ")
                          .map(
                            (word: string) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")
                      : "-"}
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
                    {selectedStudent.class}-{selectedStudent.section}
                  </p>

                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {selectedStudent.gender?.charAt(0).toUpperCase() +
                      selectedStudent.gender?.slice(1)}
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
                  {selectedStudent.parent?.Photo ? (
                    <img
                      src={
                        selectedStudent.parent.Photo.startsWith("http")
                          ? selectedStudent.parent.Photo
                          : `http://127.0.0.1:8000${selectedStudent.parent.Photo}`
                      }
                      alt="Parent"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                      {selectedStudent.parent?.Name?.charAt(0)?.toUpperCase() ||
                        "P"}
                    </div>
                  )}

                  {/* Parent Details */}
                  <div className="space-y-2 text-sm">
                    <p className="text-lg font-semibold">
                      {selectedStudent.parent.Name
                        ? selectedStudent.parent.Name.split(" ")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")
                        : "-"}
                    </p>

                    <p>
                      <span className="font-medium">Phone 1:</span>{" "}
                      {selectedStudent.parent.Phone1 || "-"}
                    </p>

                    <p>
                      <span className="font-medium">Phone 2:</span>{" "}
                      {selectedStudent.parent.Phone2 || "-"}
                    </p>

                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedStudent.parent.email || "-"}
                    </p>

                    <p>
                      <span className="font-medium">Occupation:</span>{" "}
                      {selectedStudent.parent.Occupation
                        ? selectedStudent.parent.Occupation.split(" ")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* ADDRESS CARDS */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-medium text-gray-700 mb-1">
                      Present Address
                    </p>
                    <p>{selectedStudent.parent.Present_Address || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-medium text-gray-700 mb-1">
                      Permanent Address
                    </p>
                    <p>{selectedStudent.parent.Permanent_Address || "-"}</p>
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
