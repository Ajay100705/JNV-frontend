import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
// import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

interface TeacherStats {
  totalStudents: number;
  classesToday: number;
  pendingAssignments: number;
  classesCompleted: number;
  classStrength: {
    class_name: string;
    students: number;
  }[];
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: React.ReactNode;
  color: string;
}> = ({ title, value, icon: Icon, subtitle, color }) => {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>

        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>

        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  if (!user || user.role !== "teacher") {
    return null;
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsRes = await api.get("/academic/teacher/dashboard/");
      const classRes = await api.get("/academic/teacher/today-classes/");

      setStats(statsRes.data);
      setTodayClasses(classRes.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setLoadingClasses(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Teacher Dashboard
            </h1>
          </div>

          <p className="text-gray-500 mt-1">
            Subject: {user?.profile?.subject || "N/A"}
          </p>
        </div>

        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <ClipboardList className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          subtitle={
            <div className="flex flex-wrap gap-2 text-sm">
              {stats?.classStrength?.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="font-semibold text-gray-450">
                    {c.class_name}- {c.students}
                  </span>
                </span>
              ))}
            </div>
          }
          color="bg-blue-500"
        />

        <StatCard
          title="Classes Today"
          value={stats?.classesToday || 0}
          icon={Calendar}
          subtitle="Scheduled classes"
          color="bg-purple-500"
        />

        <StatCard
          title="Classes Completed"
          value={`${stats?.classesCompleted || 0}`}
          icon={TrendingUp}
          subtitle="Attendance taken"
          color="bg-emerald-500"
        />

        <StatCard
          title="Pending Assignments"
          value={stats?.pendingAssignments || 0}
          icon={ClipboardList}
          subtitle="To be graded"
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TODAY CLASSES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Classes
            </CardTitle>

            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent>
            {loadingClasses ? (
              <div className="flex justify-center py-6">
                <Spinner className="w-6 h-6 text-blue-600" />
              </div>
            ) : todayClasses.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No classes today
              </p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls: any) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          cls.attendance_taken
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {cls.subject}
                        </p>

                        <p className="text-sm text-gray-500">
                          Class {cls.classroom}
                        </p>

                        {/* <p className="text-xs text-gray-400">
                  Period {cls.period}
                </p> */}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p className="text-sm font-medium">{cls.time}</p>

                      <p className="text-xs text-gray-800">
                        Period {cls.period}
                      </p>

                      {cls.attendance_taken ? (
                        <span className="text-xs text-green-600">
                          ✔ Attendance Taken
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          className="mt-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() =>
                            navigate(`/teacher/take-attendance/${cls.id}`)
                          }
                        >
                          Take Attendance
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// const Badge: React.FC<{
//   children: React.ReactNode;
//   className?: string;
// }> = ({ children, className }) => (
//   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
//     {children}
//   </span>
// );
