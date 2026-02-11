import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Mail, Phone, MapPin, Calendar, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

export const PrincipalProfile: React.FC = () => {
  const { user } = useAuth();

  const displayName =
  user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email || "User";

const initials = displayName
  .split(" ")
  .map((n: string) => n[0])
  .join("");


  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block">
              <Avatar className="w-32 h-32 mx-auto ring-4 ring-blue-100">
                <AvatarImage src={user?.avatar} alt={displayName} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-500 capitalize">{user?.role}</p>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-blue-500" />
                {user?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-green-500" />
                +91 9876543210
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-red-500" />
                JNV Campus, District
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-amber-500" />
                Joined January 2020
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={displayName} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={user?.email} type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="9876543210" />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input defaultValue="Principal" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="JNV Campus, Main Road, District - 123456" />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                  placeholder="Write something about yourself..."
                  defaultValue="Experienced educator with over 20 years of experience in school administration."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => toast.success('Password updated successfully')} className="bg-blue-600 hover:bg-blue-700">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
