import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { mockApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TeacherStats {
  totalStudents: number;
  classesToday: number;
  pendingAssignments: number;
  attendancePercentage: number;
}

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
        'relative overflow-hidden transition-all duration-500 transform',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
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
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await mockApi.getTeacherStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const todayClasses = [
    { subject: 'Mathematics', class: '10-A', time: '09:00 AM', status: 'completed' },
    { subject: 'Mathematics', class: '9-B', time: '10:30 AM', status: 'ongoing' },
    { subject: 'Mathematics', class: '11-A', time: '01:00 PM', status: 'upcoming' },
    { subject: 'Mathematics', class: '10-B', time: '02:30 PM', status: 'upcoming' },
  ];

  const recentAssignments = [
    { title: 'Algebra Test', class: '10-A', dueDate: 'Tomorrow', submissions: 28 },
    { title: 'Geometry Worksheet', class: '9-B', dueDate: 'In 2 days', submissions: 32 },
    { title: 'Calculus Quiz', class: '11-A', dueDate: 'Next week', submissions: 15 },
  ];

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
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          </div>
          <p className="text-gray-500 mt-1">Subject: {user?.profile?.subject || "N/A"}</p>
        </div>
        <Button 
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => toast.success('New assignment created')}
        >
          <ClipboardList className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          subtitle="Across all classes"
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          title="Classes Today"
          value={stats?.classesToday || 0}
          icon={Calendar}
          subtitle="Scheduled classes"
          color="bg-purple-500"
          delay={100}
        />
        <StatCard
          title="Pending Assignments"
          value={stats?.pendingAssignments || 0}
          icon={ClipboardList}
          subtitle="To be graded"
          color="bg-amber-500"
          delay={200}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={TrendingUp}
          subtitle="Class attendance"
          color="bg-emerald-500"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Classes
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayClasses.map((cls, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      cls.status === 'completed' ? 'bg-green-100 text-green-600' :
                      cls.status === 'ongoing' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cls.subject}</p>
                      <p className="text-sm text-gray-500">Class {cls.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{cls.time}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs capitalize',
                        cls.status === 'completed' && 'border-green-200 text-green-600',
                        cls.status === 'ongoing' && 'border-blue-200 text-blue-600',
                        cls.status === 'upcoming' && 'border-gray-200 text-gray-600'
                      )}
                    >
                      {cls.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              Recent Assignments
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">Class {assignment.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
                    <p className="text-xs text-gray-500">{assignment.submissions} submissions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// Badge component for this file
const Badge: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({ 
  children, 
  className 
}) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);
