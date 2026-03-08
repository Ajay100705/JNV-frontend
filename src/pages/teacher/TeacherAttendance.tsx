import  { useEffect, useState } from "react"
import api from "@/api/axios"
import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { Clock, BookOpen } from "lucide-react"
import { toast } from "sonner"

type ClassItem = {
  id: number
  subject: string
  classroom: string
  period: number
  time: string
  attendance_taken: boolean
}

export default function TeacherAttendance() {

  const navigate = useNavigate()

  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {

      const res = await api.get("/academic/teacher/today-classes/")
      setClasses(res.data)

    } catch {
      toast.error("Failed to load today's classes")

    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    )
  }

  return (
    <Card>

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Today's Schedule
        </CardTitle>
      </CardHeader>

      <CardContent>

        {classes.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No classes scheduled today
          </p>
        ) : (

          <div className="relative border-l-2 border-gray-200 ml-6 space-y-8">

            {classes.map((cls) => (

              <div key={cls.id} className="relative flex items-start gap-6">

                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[11px] w-5 h-5 rounded-full border-2 ${
                    cls.attendance_taken
                      ? "bg-green-500 border-green-500"
                      : "bg-orange-400 border-orange-400"
                  }`}
                />

                {/* Time */}
                <div className="w-24 text-sm text-gray-500">
                  {cls.time}
                </div>

                {/* Class Card */}
                <div className="flex-1 bg-gray-50 border rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {cls.subject}
                      </p>

                      <p className="text-sm text-gray-500">
                        Class {cls.classroom}
                      </p>

                      <p className="text-xs text-gray-400">
                        Period {cls.period}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        cls.attendance_taken
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {cls.attendance_taken ? "Completed" : "Pending"}
                    </span>

                    <Button
                      onClick={() =>
                        navigate(`/teacher/take-attendance/${cls.id}`)
                      }
                    >
                      {cls.attendance_taken
                        ? "Modify"
                        : "Take Attendance"}
                    </Button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </CardContent>

    </Card>
  )
}