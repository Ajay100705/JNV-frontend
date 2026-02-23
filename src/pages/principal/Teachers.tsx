import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Teacher } from "@/types";
import AddTeacher from "@/pages/teacher/AddTeacher";
import { getTeachers, deleteTeacher } from "@/services/teacherService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  User,
} from "lucide-react";

import { toast } from "sonner";
import { set } from "date-fns";

export const PrincipalTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch {
        toast.error("Failed to fetch teachers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();

    const handleTeacherAdded = async () => {
      setOpen(false);
      setEditTeacher(null);
      setIsLoading(true);

      const data = await getTeachers();
      setTeachers(data);

      setIsLoading(false);
      toast.success("Teacher added successfully");
    };

    window.addEventListener("teacher-added", handleTeacherAdded);

    return () => {
      window.removeEventListener("teacher-added", handleTeacherAdded);
    };
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.first_name} ${teacher.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete teacher?")) return;

    try {
      await deleteTeacher(id);
      const data = await getTeachers();
      setTeachers(data);
      toast.success("Teacher deleted");
    } catch {
      toast.error("Failed to delete teacher");
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
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Teachers Management</h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Add Teacher
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0">
            <AddTeacher />
          </DialogContent>
        </Dialog>
      </div>

      {/* EDIT TEACHER MODAL */}
      <Dialog open={!!editTeacher} onOpenChange={() => setEditTeacher(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <AddTeacher existingTeacher={editTeacher} />
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            

            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>

                  <TableCell>
                    {teacher.photo ? (
                      <img src={teacher.photo} alt="Teacher" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                    )}
                  </TableCell>


                  <TableCell>
                    {teacher.first_name} {teacher.last_name}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-gray-500" />
                      {teacher.subject}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      {teacher.phone}
                    </div>
                    </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-gray-500" />
                      {teacher.qualification}
                    </div>
                    </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem onClick={() => setEditTeacher(teacher)}>
                          <Edit size={14} className="mr-2" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Mail size={14} className="mr-2" /> Email
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(teacher.id)}
                        >
                          <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};