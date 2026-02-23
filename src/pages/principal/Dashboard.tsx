import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { mockApi } from '@/services/api';
import type { DashboardStats } from '@/types';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  UserCircle,
  School,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  color: string;
  delay: number;
  onClick?: () => void;
}> = ({ title, value, icon: Icon, trend, color, delay, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);



  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-500 transform cursor-pointer hover:shadow-lg',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      onClick={onClick}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
        {trend !== undefined && (
          <div className="flex items-center mt-2 text-sm">
            {trend >= 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+{trend}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-500">{trend}%</span>
              </>
            )}
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export const PrincipalDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await mockApi.getPrincipalStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
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

  const houseData = stats?.houseWiseStudents?.map(h => ({
    name: h.house.replace(' House', ''),
    students: h.count,
  })) || [];

  const pieData = stats?.houseWiseStudents?.map((h, i) => ({
    name: h.house.replace(' House', ''),
    value: h.count,
    color: COLORS[i % COLORS.length],
  })) || [];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Principal Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of school statistics and activities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <MoreHorizontal className="w-4 h-4" />
            More Options
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          trend={5.2}
          color="bg-blue-500"
          delay={0}
          onClick={() => navigate('/principal/students')}
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={Users}
          trend={2.1}
          color="bg-purple-500"
          delay={100}
          onClick={() => navigate('/principal/teachers')}
        />
        <StatCard
          title="Total Parents"
          value={stats?.totalParents || 0}
          icon={UserCircle}
          trend={3.8}
          color="bg-emerald-500"
          delay={200}
          onClick={() => navigate('/principal/parents')}
        />
        <StatCard
          title="Total Houses"
          value={stats?.totalHouses || 0}
          icon={School}
          trend={0}
          color="bg-amber-500"
          delay={300}
          onClick={() => navigate('/principal/houses')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold">House-wise Student Distribution</CardTitle>
          </CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={houseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold">House Distribution</CardTitle>
          </CardHeader>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Add Teacher', icon: Users, color: 'bg-blue-500', path: '/principal/add-teacher' },
            { label: 'Add Student', icon: GraduationCap, color: 'bg-purple-500', path: '/principal/add-student' },
            { label: 'Add Parent', icon: UserCircle, color: 'bg-emerald-500' },
            { label: 'View Reports', icon: TrendingUp, color: 'bg-amber-500' },
          ].map((action, index) => (
            <Button
              key={action.label}
              variant="outline"
              className="flex flex-col items-center gap-3 h-auto py-6 hover:bg-gray-50 transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(action.path || '#')}
            >
              <div className={`${action.color} p-3 rounded-xl`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>
    </>
  );
};
