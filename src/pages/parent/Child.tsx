import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import api from "@/api/axios";
import {
  UserCircle,
  Calendar,
  Home,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Attendance {
  date: string;
  status: string;
}

interface Mark {
  subject: string;
  marks: number;
  total: number;
}

interface ChildDetails {
  id: number;
  name: string;
  rollNumber: string;
  house: string;
  class: string;
  section: string;
  attendance: number;
  subjects: string[];
  recentAttendance: Attendance[];
  marks: Mark[];
}

export const ParentChild: React.FC = () => {
  const [child, setChild] = useState<ChildDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const profileRes = await api.get("/parents/profile/");
        const parent = profileRes.data;
        const student = parent.children[0];

        const attendanceRes = await api.get(
          `/academic/parent/child-attendance/${student.id}/`,
        );

        const marksRes = await api.get(
          `/classes/student-marks/?student=${student.id}`,
        );

        const attendance = attendanceRes.data;

        const total = attendance.length;
        const present = attendance.filter(
          (a: any) => a.status === "present",
        ).length;

        const attendancePercentage =
          total > 0 ? Math.round((present / total) * 100) : 0;

        const marks: Mark[] = marksRes.data.map((m: any) => ({
          subject: m.subject_exam.subject.name,
          marks: m.marks_obtained,
          total: m.subject_exam.total_marks,
        }));

        setChild({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          rollNumber: student.admission_number,
          house: student.house_name,
          class: student.class_name,
          section: student.section,
          attendance: attendancePercentage,
          subjects: marks.map((m) => m.subject),
          recentAttendance: attendance.slice(0, 5),
          marks,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load child data");
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, []);

  const getAttendanceIcon = (status: string) => {
    if (status === "present")
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "absent")
      return <XCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Child's Profile</h1>
        <p className="text-gray-500 mt-1">
          View detailed information about your child
        </p>
      </div>

      {/* Child Info */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {child?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{child?.name}</h2>

              <div className="flex flex-wrap gap-4 mt-3">
                <Badge variant="outline">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  Class {child?.class}-{child?.section}
                </Badge>

                <Badge variant="outline">
                  <Home className="w-4 h-4 mr-1" />
                  {child?.house}
                </Badge>

                <Badge variant="outline">
                  <UserCircle className="w-4 h-4 mr-1" />
                  Roll: {child?.rollNumber}
                </Badge>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600">
                {child?.attendance}%
              </div>
              <p className="text-sm text-gray-500 mt-1">Attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Academic Performance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {child?.marks.map((mark, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{mark.subject}</span>

                  <div className="text-right">
                    <p className="font-bold">
                      {mark.marks}/{mark.total}
                    </p>

                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(mark.marks / mark.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Recent Attendance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {child?.recentAttendance.map((att, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getAttendanceIcon(att.status)}

                    <div>
                      <p className="font-medium">
                        {new Date(att.date).toLocaleDateString()}
                      </p>

                      <p className="text-sm text-gray-500 capitalize">
                        {att.status}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      att.status === "present"
                        ? "border-green-200 text-green-600"
                        : "border-red-200 text-red-600",
                    )}
                  >
                    {att.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
