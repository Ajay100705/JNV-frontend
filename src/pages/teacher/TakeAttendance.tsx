import  { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
// import { set } from "date-fns";

type StudentAttendance = {
  student_id: number
  student_name: string
  admission_number: string
  status: string | null
}

export default function TakeAttendance() {

  const { timetableId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [date, setDate] = useState("")
  const [timetable, setTimetable] = useState<any>(null)

  const loadData = async () => {
    try {

      const res = await api.get(
        `/academic/teacher/take-attendance/${timetableId}/`
      )

      setStudents(res.data.students)
      setTimetable(res.data.timetable)
      setDate(res.data.date)

    } catch (error) {
      toast.error("Failed to load attendance")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateStatus = (studentId: number, status: string) => {

    setStudents(prev =>
      prev.map(s =>
        s.student_id === studentId
          ? { ...s, status }
          : s
      )
    )
  }

  const saveAttendance = async () => {

    try {

      const payload = {
        timetable_id: Number(timetableId),
        date: date,
        attendance_data: students.map(s => ({
          student_id: s.student_id,
          status: s.status || "PRESENT"
        }))
      }

      await api.post(
        `/academic/teacher/take-attendance/${timetableId}/`,
        payload
      )

      toast.success("Attendance saved successfully")
      setTimeout(() => {
        navigate(-1)
      }, 1000)

    } catch {
      toast.error("Failed to save attendance")
    }
  }

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: "PRESENT",
      }))
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="w-10 h-10 text-blue-600"/>
      </div>
    )

  const totalStudents = students.length;

  const presentCount = students.filter(
    (s) => s.status === "PRESENT"
  ).length;

  const absentCount = students.filter(
    (s) => s.status === "ABSENT"
  ).length;

  const leaveCount = students.filter(
    (s) => s.status === "LEAVE"
  ).length;

  return (
    <>

      <div className="flex justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Take Attendance
          </h1>

          <p className="text-gray-500">
            {timetable?.classroom_name} • {timetable?.subject_name}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">

          <Badge>
            Period {timetable?.time_slot_detail?.period_number}
          </Badge>

          <p className="text-sm text-gray-500">
            {timetable?.time_slot_detail?.start_time?.slice(0,5)} - 
            {timetable?.time_slot_detail?.end_time?.slice(0,5)}
          </p>

        </div>

      </div>

      <Card>

        <CardHeader>
          <CardTitle>
            Students ({students.length})
          </CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Admission</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Leave</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {students.map((student, index) => (

                <TableRow 
                  key={student.student_id}
                  className={
                    student.status === "PRESENT"
                      ? "bg-green-50"
                      : student.status === "ABSENT"
                      ? "bg-red-50"
                      : student.status === "LEAVE"
                      ? "bg-yellow-50"
                      : "bg-orange-50"
                  }
                >

                  <TableCell
                    className={`pl-3 ${
                      !student.status ? "border-l-4 border-orange-400" : ""
                    }`}
                  >
                    <span className="font-bold">{index + 1}.  </span>{student.student_name}
                  </TableCell>

                  <TableCell>
                    {student.admission_number}
                  </TableCell>

                  <TableCell>
                    <input
                      type="radio"
                      name={`att-${student.student_id}`}
                      checked={student.status === "PRESENT"}
                      onChange={() =>updateStatus(student.student_id, "PRESENT")}
                      className="accent-green-600 w-4 h-4"
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      type="radio"
                      name={`att-${student.student_id}`}
                      checked={student.status === "ABSENT"}
                      onChange={() =>updateStatus(student.student_id, "ABSENT")}
                      className="accent-red-600 w-4 h-4"
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      type="radio"
                      name={`att-${student.student_id}`}
                      checked={student.status === "LEAVE"}
                      onChange={() => updateStatus(student.student_id, "LEAVE")}
                      className="accent-yellow-500 w-4 h-4"
                    />
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

          <div className="mt-6 border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm">

            <p className="text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded inline-block">
              <span className="font-semibold">Date:</span> {date}
            </p>

            <p className="text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded inline-block">
              <span className="font-semibold">Subject:</span> {timetable?.subject_name}
            </p>

            <p className="text-indigo-700 font-semibold bg-indigo-50 px-3 py-1 rounded inline-block">
              <span className="font-semibold">Period:</span>{" "}
              {timetable?.time_slot_detail?.period_number} (
              {timetable?.time_slot_detail?.start_time?.slice(0,5)} -
              {timetable?.time_slot_detail?.end_time?.slice(0,5)}
              )
              
            </p>

            <p className="text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded inline-block">
              <span className="font-semibold">Total Students:</span> {totalStudents}
            </p>

            <p className="text-green-700 font-semibold bg-green-50 px-2 py-1 rounded">
              Present: {presentCount}
            </p>

            <p className="text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
              Absent: {absentCount}
            </p>

            <p className="text-yellow-600 font-semibold bg-yellow-50 px-2 py-1 rounded">
              Leave: {leaveCount}
            </p>

          </div>

          

          <div className="flex justify-between mt-6">

            <Button
              onClick={markAllPresent}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Mark All Present
            </Button>

            <Button onClick={saveAttendance}>
              Save Attendance
            </Button>

          </div>

        </CardContent>

      </Card>

    </>
  )
}