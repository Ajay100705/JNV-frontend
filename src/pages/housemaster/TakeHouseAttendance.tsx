import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StudentAttendance = {
  student_id: number;
  student_name: string;
  admission_number: string;
  class: string;
  section: string;
  status: string | null;
};

export default function TakeHouseAttendance() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get("/houses/take-house-attendance/");

      setStudents(res.data.students);
      setDate(res.data.date);
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (studentId: number, status: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status } : s)),
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: "present",
      })),
    );
  };

  const saveAttendance = async () => {
    try {
      const payload = {
        date: date,

        attendance_data: students.map((s) => ({
          student_id: s.student_id,

          status: s.status || "present",
        })),
      };

      await api.post("/houses/take-house-attendance/", payload);

      toast.success("House attendance saved");

      setTimeout(() => {
      navigate(-1); 
    }, 800);
    } catch {
      toast.error("Failed to save attendance");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );

  const groupedStudents = students.reduce((acc: any, student) => {
    const key = `${student.class}-${student.section}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(student);

    return acc;
  }, {});

  const classes = Object.keys(groupedStudents).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );

  const totalStudents = students.length;

  const presentCount = students.filter((s) => s.status === "present").length;

  const leaveCount = students.filter((s) => s.status === "leave").length;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">House Attendance</h1>

      {classes.map((cls) => (
        <Card key={cls} className="mb-6">
          <CardHeader>
            <CardTitle>
              Class {cls} ({groupedStudents[cls].length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>

                  <TableHead>Admission</TableHead>

                  <TableHead>Present</TableHead>

                  <TableHead>Leave</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {groupedStudents[cls].map(
                  (student: StudentAttendance, index: number) => (
                    <TableRow
                      key={student.student_id}
                      className={
                        student.status === "present"
                          ? "bg-green-50"
                          : student.status === "leave"
                            ? "bg-yellow-50"
                            : "bg-orange-50"
                      }
                    >
                      <TableCell>
                        <span className="font-bold">{index + 1}. </span>

                        {student.student_name}
                      </TableCell>

                      <TableCell>{student.admission_number}</TableCell>

                      <TableCell>
                        <input
                          type="radio"
                          name={`att-${student.student_id}`}
                          checked={student.status === "present"}
                          onChange={() =>
                            updateStatus(student.student_id, "present")
                          }
                          className="accent-green-600 w-4 h-4"
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="radio"
                          name={`att-${student.student_id}`}
                          checked={student.status === "leave"}
                          onChange={() =>
                            updateStatus(student.student_id, "leave")
                          }
                          className="accent-yellow-500 w-4 h-4"
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <p className="bg-blue-50 px-3 py-1 rounded">Date: {date}</p>

            <p className="bg-gray-100 px-3 py-1 rounded">
              Total Students: {totalStudents}
            </p>

            <p className="bg-green-50 px-3 py-1 rounded">
              Present: {presentCount}
            </p>

            <p className="bg-yellow-50 px-3 py-1 rounded">
              Leave: {leaveCount}
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              onClick={markAllPresent}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark All Present
            </Button>

            <Button onClick={saveAttendance}>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
