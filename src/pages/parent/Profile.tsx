import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/api/axios";
import { Mail, Phone, MapPin, Users, Save } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface Child {
  id: number;
  first_name: string;
  last_name: string;
  admission_number: string;
  class_name: string;
  section: string;
  house_name: string;
  house_category: string;
  photo: string;
}

interface ParentProfileData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone1: string;
  phone2?: string;
  job?: string;
  present_address: string;
  permanent_address: string;
  photo?: string;
  children: Child[];
}

export const ParentProfile: React.FC = () => {
  const [profile, setProfile] = useState<ParentProfileData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/parents/profile/");
        setProfile(res.data);
        setForm(res.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
  try {
    setSaving(true);

    const formData = new FormData();

    Object.keys(form).forEach((key) => {

      // skip children (not needed in update)
      if (key === "children") return;

      // send photo only if it's a File
      if (key === "photo") {
        if (form.photo instanceof File) {
          formData.append("photo", form.photo);
        }
        return;
      }

      if (form[key] !== undefined && form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    const res = await api.patch("/parents/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Profile updated");

    setProfile(res.data);
    setForm(res.data);
    setPhotoPreview(null);

    setOpen(false);

  } catch (err: any) {

    console.log(err.response?.data);

    if (err.response?.data) {
      Object.values(err.response.data).forEach((msg: any) => {
        toast.error(msg[0]);
      });
    } else {
      toast.error("Update failed");
    }

  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );
  }

  const child = profile?.children?.[0];

  const displayName = `${profile?.first_name} ${profile?.last_name}`;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500">Manage your personal information</p>
        </div>

        <Button
          onClick={() => {
            setPhotoPreview(null);
            setOpen(true);

          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage
                src={
                  profile?.photo ? `http://127.0.0.1:8000${profile.photo}` : ""
                }
              />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-xl font-bold">{displayName}</h2>

            <p className="text-gray-500">@{profile?.username}</p>

            {child && (
              <div className="mt-2 text-sm text-amber-600 flex justify-center gap-1">
                <Users size={16} />
                Child: {child.first_name} {child.last_name}
              </div>
            )}

            <div className="mt-6 space-y-3 text-left">
              <div className="flex gap-2 text-sm text-gray-600">
                <Mail size={16} /> {profile?.email}
              </div>

              <div className="flex gap-2 text-sm text-gray-600">
                <Phone size={16} /> {profile?.phone1}
              </div>

              <div className="flex gap-2 text-sm text-gray-600">
                <MapPin size={16} /> {profile?.present_address}
              </div>
            </div>
          </CardContent>
        </Card>

        {child && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Child Information</h3>

              <div className="flex items-center gap-4">
                <img
                  src={`http://127.0.0.1:8000${child.photo}`}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-lg">
                    {child.first_name} {child.last_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Class {child.class_name}-{child.section}
                  </p>

                  <p className="text-sm text-gray-500">
                    House: {child.house_name}-{child.house_category}
                  </p>

                  <p className="text-sm text-gray-500">
                    Admission: {child.admission_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Card className="mt-6">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Parent Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">{profile?.first_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">{profile?.last_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{profile?.phone1}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Alternative Phone</p>
              <p className="font-medium">{profile?.phone2 || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Occupation</p>
              <p className="font-medium">{profile?.job || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Present Address</p>
              <p className="font-medium">{profile?.present_address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Permanent Address</p>
              <p className="font-medium">{profile?.permanent_address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">

    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
    </DialogHeader>

    <div className="space-y-6">

      {/* Profile Photo */}
      <div className="flex flex-col items-center gap-3">

        <img
  src={
    photoPreview
      ? photoPreview
      : profile?.photo
      ? `http://127.0.0.1:8000${profile.photo}`
      : undefined
  }
  alt="Preview"
  className="w-24 h-24 rounded-full object-cover border shadow"
/>

        <Input
          type="file"
          accept="image/*"
          className="max-w-xs"
          onChange={(e: any) => {
            const file = e.target.files[0]
            if (!file) return

            setForm({
              ...form,
              photo: file,
            })

            setPhotoPreview(URL.createObjectURL(file))
            e.target.value = "";
          }}
        />

      </div>


      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <Label>First Name</Label>
          <Input
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Last Name</Label>
          <Input
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Username</Label>
          <Input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            name="phone1"
            value={form.phone1 || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Alternative Phone</Label>
          <Input
            name="phone2"
            value={form.phone2 || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Job</Label>
          <Input
            name="job"
            value={form.job || ""}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Present Address</Label>
          <Input
            name="present_address"
            value={form.present_address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Permanent Address</Label>
          <Input
            name="permanent_address"
            value={form.permanent_address || ""}
            onChange={handleChange}
          />
        </div>

      </div>

    </div>

    <DialogFooter className="mt-6">

      <Button
        variant="outline"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button
        disabled={saving}
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 flex gap-2"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save Changes"}
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>
    </>
  );
};
