import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Mail, Phone, MapPin, BookOpen, Shield, Save, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/axios';
import { Eye, EyeOff } from 'lucide-react'; 

export const TeacherProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();

  if (!user || user.role !== "teacher") {
    return null;
  }

  const displayName =
  user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email || "User";

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    gender: "",

    phone1: "",
    phone2: "",
    photo: "",
    subject: "",
    present_address: "",
    permanent_address: "",
    date_of_joining: "",
    qualification: "",
    experience_years: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user ) return;
  
    const profile = user.profile; 
  
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "",
        phone1: profile?.phone1 || "",
        phone2: profile?.phone2 || "",
        photo: profile?.photo || "",
        subject: profile?.subject || "N/A",
        present_address: profile?.present_address || "",
        permanent_address: profile?.permanent_address || "",
        gender: user.gender || "",
        qualification: profile?.qualification || "",
        experience_years: profile?.experience_years || "",
        date_of_joining: profile?.date_of_joining || "",
        
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleSave = async () => {
    try {
      const data = new FormData();

      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone1", formData.phone1 || "");
      data.append("phone2", formData.phone2 || "");
      data.append("gender", formData.gender || "");
      data.append("present_address", formData.present_address || "");
      data.append("permanent_address", formData.permanent_address || "");
      data.append("date_of_joining", formData.date_of_joining || "");
      data.append("experience_years", formData.experience_years || "");
      data.append("qualification", formData.qualification || "");
      if (selectedFile) {
        data.append("photo", selectedFile);
      }

      await api.put("/teachers/update-profile/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refreshUser();

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error("Failed to update profile");
    }
  };

  // ===== PASSWORD STATE =====
const [passwordData, setPasswordData] = useState({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const [showPassword, setShowPassword] = useState({
  current: false,
  new: false,
  confirm: false,
});

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setPasswordData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleUpdatePassword = async () => {
  if (passwordData.new_password !== passwordData.confirm_password) {
    toast.error("New passwords do not match");
    return;
  }

  try {
    await api.put("/auth/change-password/", {
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
    });

    toast.success("Password updated successfully");

    // 🔥 CLEAR FORM AFTER SUCCESS
    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

  } catch (error: any) {
    toast.error("Failed to update password");
  }
};

  

  

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">

            <div className="relative inline-block">
            
                          {/* Hidden File Input */}
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            hidden
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSelectedFile(e.target.files[0]);
                              }
                            }}
                            disabled={!isEditing} // Disable file input when not editing
                          />
            
                          <Avatar
                            className="w-32 h-32 mx-auto ring-4 ring-blue-100 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <AvatarImage
                              src={
                                selectedFile
                                  ? URL.createObjectURL(selectedFile)
                                  : user.profile?.photo
                                    ? `http://127.0.0.1:8000${user.profile.photo}`
                                    : undefined
                              }
                              alt={displayName}
                            />
            
                            <AvatarFallback className="text-4xl font-semibold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
            
                          {/* Camera Button */}
                          <Button
                            type="button"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700"
                          >
                  <Camera className="w-4 h-4" />
              </Button>
            
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-500 capitalize">{user?.role}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
              <BookOpen className="w-4 h-4" />
              {user?.profile.subject}
            </div>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-blue-500" />
                {user?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-green-500" />
                {user?.profile.phone1 || "N/A"}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-red-500" />
                {user?.profile.present_address}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                {user?.profile.qualification || "N/A"}
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
                          <Label>First Name</Label>
                          <Input name="first_name" value={formData.first_name} onChange={handleChange} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input name="last_name" value={formData.last_name} onChange={handleChange} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input name="email" value={formData.email} onChange={handleChange} type="email" disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number 1</Label>
                          <Input name="phone1" value={formData.phone1 || ''} onChange={handleChange} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number 2</Label>
                          <Input name="phone2" value={formData.phone2 || ''} onChange={handleChange} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Input name="subject" value={formData.subject || ''} onChange={handleChange} disabled={!isEditing} />
                        </div>
                      </div>
                      
        
                      <div className="space-y-2">
                        <Label>Present Address</Label>
                        <Input name="present_address" value={formData.present_address} onChange={handleChange} disabled={!isEditing} />
                      </div>
        
                      <div className="space-y-2">
                        <Label>Permanent Address</Label>
                        <Input name="permanent_address" value={formData.permanent_address} onChange={handleChange} disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>Qualification</Label>
                        <Input name="qualification" value={formData.qualification}  disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>Years of Experience</Label>
                        <Input name="experience_years" value={formData.experience_years}  disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Joining</Label>
                        <Input name="date_of_joining" value={formData.date_of_joining} disabled={!isEditing} />
                      </div>
                      
        
                      <div className="flex justify-end gap-3">
        
                        {!isEditing ? (
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Update Profile
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                // Reset form back to original user data
                                if (user) {
                                  const profile = user.profile;
                                  setFormData({
                                    first_name: user.first_name || "",
                                    last_name: user.last_name || "",
                                    email: user.email || "",
                                    role: user.role || "",
                                    gender: user.gender || "",
                                    phone1: profile.phone1 || "",
                                    phone2: profile.phone2 || "",
                                    photo: profile.photo || "",
                                    subject: profile.subject || "",
                                    present_address: profile.present_address || "",
                                    permanent_address: profile.permanent_address || "",
                                    date_of_joining: profile.date_of_joining || "",
                                    qualification: profile.qualification || "",
                                    experience_years: profile.experience_years || "",
                                  });
                                }
                              }}
                            >
                              Cancel
                            </Button>
        
                            <Button
                              onClick={async () => {
                                await handleSave();
                                setIsEditing(false);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save Changes
                            </Button>
                          </>
                        )}
        
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
                <div className="relative">
                  <Input
                    type={showPassword.current ? "text" : "password"}
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword.new ? "text" : "password"}
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleUpdatePassword}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
