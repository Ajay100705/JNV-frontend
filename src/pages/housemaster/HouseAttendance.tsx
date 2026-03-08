import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: number;
  name: string;
  photo: string;
  admission_number: string;
  class: string;
  section: string;
  attendance: {
    total: number;
    present: number;
    leave: number;
  };
}

export const HouseAttendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/houses/house-students/");
      setStudents(res.data);
    } catch {
      toast.error("Failed to load attendance");
    }
  };

  const classes = [
    "all",
    ...Array.from(new Set(students.map((s) => `${s.class}-${s.section}`))),
  ];

  const filteredStudents =
    selectedClass === "all"
      ? students
      : students.filter((s) => `${s.class}-${s.section}` === selectedClass);

  const getPercentage = (student: Student) => {
    const { total, present, leave } = student.attendance;
    if (total === 0) return 0;
    return Math.round(((present + leave) / total) * 100);
  };

  const badgeColor = (percentage: number) => {
    if (percentage < 75) return "bg-red-100 text-red-700";
    if (percentage < 85) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const rowColor = (percentage: number) => {
    if (percentage < 75) return "bg-red-50 border-l-4 border-red-400";
    if (percentage < 85) return "bg-yellow-50 border-l-4 border-yellow-400";
    return "bg-green-50 border-l-4 border-green-400";
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">House Attendance</h1>
          <p className="text-gray-500 text-sm">
            View attendance percentage of house students
          </p>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/teacher/take-house-attendance")}
        >
          <Calendar className="w-4 h-4 " />
          Take Attendance
        </Button>
      </div>

      {/* Class Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-10 px-3 border rounded-md"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls === "all" ? "All Classes" : `Class ${cls}`}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Admission No</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredStudents.map((student) => {
                const percentage = getPercentage(student);
                const attended =
                  student.attendance.present + student.attendance.leave;

                return (
                  <TableRow key={student.id} className={rowColor(percentage)}>
                    <TableCell>
                      {student.photo ? (
                        <img
                          src={`http://127.0.0.1:8000${student.photo}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>

                    <TableCell>{student.admission_number}</TableCell>

                    <TableCell>
                      {student.class}-{student.section}
                    </TableCell>

                    <TableCell>
                      {attended}/{student.attendance.total}
                    </TableCell>

                    <TableCell>
                      <Badge className={badgeColor(percentage)}>
                        {percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
