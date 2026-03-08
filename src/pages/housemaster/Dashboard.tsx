import React, { useEffect, useState } from "react";
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  getHouseMasterStats,
  getTodayLeaveStudents,
} from "@/services/houseService";
// import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  Home,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Action } from "@radix-ui/react-alert-dialog";

interface HouseMasterStats {
  totalStudents: number;
  attendancePercentage: number;
  presentToday: number;
  leaveToday: number;
  house: string;
}

// interface QuickAction {
//   label: string;
//   icon: React.ElementType;
//   color: string;
//   path?: string;
// }

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  color: string;
  delay: number;
}> = ({ title, value, icon: Icon, subtitle, color, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-500 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
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

export const HouseMasterDashboard: React.FC = () => {
  // const { user } = useAuth();
  const [stats, setStats] = useState<HouseMasterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [leaveStudents, setLeaveStudents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getHouseMasterStats();
        setStats(statsData);

        const leave = await getTodayLeaveStudents();
        setLeaveStudents(leave);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {stats?.house} Dashboard
            </h1>
          </div>
          <p className="text-gray-500 mt-1">
            Manage your house students and attendance
          </p>
        </div>
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/teacher/take-house-attendance")}
        >
          <Calendar className="w-4 h-4" />
          Mark Attendance
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          subtitle="In your house"
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={TrendingUp}
          subtitle="Today's attendance"
          color="bg-emerald-500"
          delay={100}
        />
        <StatCard
          title="Present Today"
          value={stats?.presentToday || 0}
          icon={CheckCircle}
          subtitle="Students present"
          color="bg-green-500"
          delay={200}
        />
        <StatCard
          title="Leave"
          value={stats?.leaveToday || 0}
          icon={XCircle}
          subtitle="Students on leave"
          color="bg-red-500"
          delay={300}
        />
      </div>

      {/* Recent Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today's Leave Students</CardTitle>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setIsDialogOpen(true)}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveStudents.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === "present"
                          ? "bg-green-100 text-green-600"
                          : item.status === "absent"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {item.status === "present" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : item.status === "absent" ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        <Calendar className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {item.status}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Leave Students Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>All Leave Students Today</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {leaveStudents.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                    </div>

                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">Leave</p>
                    </div>
                  </div>

                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "View Students", 
                  icon: Users, 
                  color: "bg-blue-500" ,
                  path: "/teacher/house-students",
                },
                {
                  label: "Attendance Report",
                  icon: Calendar,
                  color: "bg-emerald-500",
                  path: "/teacher/house-attendance",

                },
                {
                  label: "Send Notice",
                  icon: TrendingUp,
                  color: "bg-purple-500",
                  path: "",
                },
                { label: "House Events", 
                  icon: Home, 
                  color: "bg-amber-500" ,
                  path: "",
                },

              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="flex flex-col items-center gap-3 h-auto py-6 hover:bg-gray-50"
                  onClick={() => action.path
                    ? navigate(action.path) 
                    : toast.info(`${action.label} coming soon`)}
                >

                  <div className={`${action.color} p-3 rounded-xl`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
