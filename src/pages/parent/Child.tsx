import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { mockApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  UserCircle,
  Calendar,
  Home,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChildDetails {
  id: string;
  name: string;
  rollNumber: string;
  house: string;
  class: string;
  section: string;
  attendance: number;
  subjects: string[];
  recentAttendance: { date: string; status: string }[];
}

export const ParentChild: React.FC = () => {
  const { user } = useAuth();
  const [child, setChild] = useState<ChildDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const response = await mockApi.getChildDetails(user?.childId || 'S001');
        setChild(response.data);
      } catch (error) {
        toast.error('Failed to fetch child details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildDetails();
  }, [user?.childId]);

  const marksData = [
    { subject: 'Mathematics', marks: 85, total: 100, grade: 'A' },
    { subject: 'Science', marks: 78, total: 100, grade: 'B+' },
    { subject: 'English', marks: 92, total: 100, grade: 'A+' },
    { subject: 'Hindi', marks: 88, total: 100, grade: 'A' },
    { subject: 'Social Science', marks: 75, total: 100, grade: 'B' },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getAttendanceIcon = (status: string) => {
    if (status === 'present') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'absent') return <XCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Child's Profile</h1>
        <p className="text-gray-500 mt-1">View detailed information about your child</p>
      </div>

      {/* Child Info Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {child?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{child?.name}</h2>
              <div className="flex flex-wrap gap-4 mt-3">
                <Badge variant="outline" className="gap-1 px-3 py-1">
                  <GraduationCap className="w-4 h-4" />
                  Class {child?.class}-{child?.section}
                </Badge>
                <Badge variant="outline" className="gap-1 px-3 py-1">
                  <Home className="w-4 h-4" />
                  {child?.house}
                </Badge>
                <Badge variant="outline" className="gap-1 px-3 py-1">
                  <UserCircle className="w-4 h-4" />
                  Roll: {child?.rollNumber}
                </Badge>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600">{child?.attendance}%</div>
              <p className="text-sm text-gray-500 mt-1">Attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marksData.map((mark, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{mark.subject}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{mark.marks}/{mark.total}</p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(mark.marks / mark.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Badge className={getGradeColor(mark.grade)}>{mark.grade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {child?.recentAttendance.map((att, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      att.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                    )}>
                      {getAttendanceIcon(att.status)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {new Date(att.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{att.status}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize',
                      att.status === 'present'
                        ? 'border-green-200 text-green-600'
                        : 'border-red-200 text-red-600'
                    )}
                  >
                    {att.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {child?.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
