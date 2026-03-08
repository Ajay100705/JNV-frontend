import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import type { TeacherAllStudent } from "@/types";
import api from "@/api/axios";

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
  // Home,
  User,
} from "lucide-react";

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

const attendanceColor = (percent?: number) => {
  if (!percent) return "bg-gray-100 text-gray-600"

  if (percent >= 90) return "bg-green-100 text-green-700"
  if (percent >= 75) return "bg-yellow-100 text-yellow-700"
  return "bg-red-100 text-red-700"
}

export const TeacherTotalStudents: React.FC = () => {
  const [students, setStudents] = useState<TeacherAllStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] =
    useState<TeacherAllStudent | null>(null);

  const loadStudents = async () => {
    try {
      const res = await api.get(
        "/academic/teacher/all-students/"
      );
      setStudents(res.data?.students || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
          "Only class teachers can access this page"
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = students.filter((s) => {

    const matchesSearch =
      `${s.name} ${s.admission_number}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesHouse =
      selectedHouse === "all" ||
      s.house_name === selectedHouse

    const matchesClass =
      selectedClass === "all" ||
      s.classroom === selectedClass

    return matchesSearch && matchesHouse && matchesClass
  });

  const uniqueHouses = Array.from(
    new Set(
      students
        .map((s) => s.house_name)
        .filter((v): v is string => Boolean(v))
    )
  );

  const uniqueClasses = Array.from(
    new Set(
      students
        .map((s) => s.classroom)
        .filter((v): v is string => Boolean(v))
    )
  );

  if (loading)
    return (
      <div className="flex justify-center h-[60vh] items-center">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">My Class Students</h1>
      </div>

      {/* SEARCH + FILTER */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by name or admission number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* House Filter */}
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Houses</option>
              {uniqueHouses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Classes</option>

              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}

            </select>

          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students ({filtered.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Attendance</TableHead>
                {/* <TableHead>Parent</TableHead>
                <TableHead>Phone</TableHead> */}
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  
                  {/* Photo */}
                  <TableCell>
                    {student.photo ? (
                      <img
                        src={
                          student.photo.startsWith("http")
                            ? student.photo
                            : `http://127.0.0.1:8000${student.photo}`
                        }
                        alt="Student"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                    )}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {student.admission_number}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{student.classroom || "-"}</TableCell>

                  {/* Attendance */}
                  <TableCell>
                    <Badge
                      className={
                        student.attendance_percentage >= 90
                          ? "bg-green-100 text-green-700"
                          : student.attendance_percentage >= 75
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {student.present}/{student.total_classes}
                    </Badge>
                  </TableCell>

                  {/* Parent */}
                  {/* <TableCell>
                    {student.parent_name || "-"}
                  </TableCell> */}

                  {/* Phone */}
                  {/* <TableCell>
                    {student.parent_phone1 || "-"}
                  </TableCell> */}

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSelectedStudent(student)
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PARENT DETAILS DIALOG */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
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
      <p className="text-2xl font-bold">
        {selectedStudent.name}
      </p>

      <p className="text-sm opacity-90">
        {selectedStudent.admission_number}
      </p>

      <div className="flex gap-2 mt-2 flex-wrap">

        <Badge className="bg-white/20 text-white border-white/40">
          {selectedStudent.gender}
        </Badge>

        <Badge className="bg-white/20 text-white border-white/40">
          {selectedStudent.house_name} - {selectedStudent.house_category}
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
          {selectedStudent.house_name} - {selectedStudent.house_category}
        </Badge>
      </p>

      <p>
        <span className="font-medium">Gender:</span>{" "}
        {selectedStudent.gender}
      </p>

      {/* Attendance */}
      <div className="flex items-center gap-2">
        <span className="font-medium">Attendance:</span>

        <Badge className={attendanceColor(selectedStudent.attendance_percentage)}>
          {selectedStudent.present}/{selectedStudent.total_classes} ({selectedStudent.attendance_percentage}%)
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">

        <Badge className="bg-green-100 text-green-700">
          Present: {selectedStudent.present}
        </Badge>

        <Badge className="bg-red-100 text-red-700">
          Absent: {selectedStudent.absent}
        </Badge>

        <Badge className="bg-yellow-100 text-yellow-700">
          Leave: {selectedStudent.leave}
        </Badge>

      </div>

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
          {selectedStudent.parent_name || "-"}
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
          {selectedStudent.parent_job || "-"}
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