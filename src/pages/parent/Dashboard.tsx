import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
// import { Badge } from '@/components/ui/badge';
import { mockApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  UserCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Home,
  GraduationCap,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ParentStats {
  childName: string;
  rollNumber: string;
  class: string;
  section: string;
  attendancePercentage: number;
  house: string;
  recentMarks: { subject: string; marks: number; total: number }[];
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

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ParentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await mockApi.getParentStats(user?.childId || 'S001');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.childId]);

  const recentNotifications = [
    { title: 'Parent-Teacher Meeting', date: 'Tomorrow, 10:00 AM', type: 'event' },
    { title: 'Unit Test Results Published', date: '2 days ago', type: 'academic' },
    { title: 'Fee Payment Reminder', date: '3 days ago', type: 'fee' },
  ];

  const teacherMessages = [
    { from: 'Mrs. Priya Sharma', subject: 'Mathematics Progress', date: 'Today', unread: true },
    { from: 'Mr. Rajesh Verma', subject: 'Science Project', date: 'Yesterday', unread: false },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner className="w-12 h-12 text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your child's progress</p>
        </div>
        <Button 
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => toast.success('Message sent to teacher')}
        >
          <MessageSquare className="w-4 h-4" />
          Contact Teacher
        </Button>
      </div>

      {/* Child Info Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <UserCircle className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{stats?.childName}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  Class {stats?.class}-{stats?.section}
                </span>
                <span className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {stats?.house}
                </span>
                <span>Roll: {stats?.rollNumber}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats?.attendancePercentage}%</div>
              <p className="text-sm text-white/80">Attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={TrendingUp}
          subtitle="This month"
          color="bg-emerald-500"
          delay={0}
        />
        <StatCard
          title="Total Subjects"
          value={5}
          icon={GraduationCap}
          subtitle="Active subjects"
          color="bg-blue-500"
          delay={100}
        />
        <StatCard
          title="New Messages"
          value={2}
          icon={MessageSquare}
          subtitle="From teachers"
          color="bg-purple-500"
          delay={200}
        />
        <StatCard
          title="Upcoming Events"
          value={3}
          icon={Calendar}
          subtitle="This month"
          color="bg-amber-500"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Marks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Recent Marks
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentMarks.map((mark, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mark.subject}</p>
                      <p className="text-sm text-gray-500">Latest exam</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      (mark.marks / mark.total) >= 0.8 ? 'text-emerald-600' :
                      (mark.marks / mark.total) >= 0.6 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {mark.marks}/{mark.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round((mark.marks / mark.total) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Notifications
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notif, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.type === 'event' ? 'bg-purple-100 text-purple-600' :
                    notif.type === 'academic' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-500">{notif.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Messages */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Messages from Teachers
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teacherMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {msg.from.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{msg.from}</p>
                      {msg.unread && (
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{msg.subject}</p>
                  </div>
                  <span className="text-xs text-gray-400">{msg.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
