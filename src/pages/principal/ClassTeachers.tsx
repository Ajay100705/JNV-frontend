import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getClassTeachers, deleteClassTeacher } from "@/services/academicService";
import { AddClassTeacher} from "./AddClassTeacher";

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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Search,
  Plus,
  MoreVertical,
  Trash2,
  User,
  GraduationCap,
} from "lucide-react";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { ClassTeacher } from "@/types";

export const PrincipalClassTeachers: React.FC = () => {
  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getClassTeachers();
      setClassTeachers(data);
    } catch {
      toast.error("Failed to fetch class teachers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleAdded = () => {
      setOpen(false);
      fetchData();
      toast.success("Class Teacher Assigned");
    };

    window.addEventListener("class-teacher-added", handleAdded);

    return () => {
      window.removeEventListener("class-teacher-added", handleAdded);
    };
  }, []);

  const filtered = classTeachers.filter((ct) =>
    ct.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ct.classroom_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this class teacher?")) return;

    try {
      await deleteClassTeacher(id);
      fetchData();
      toast.success("Removed successfully");
    } catch {
      toast.error("Failed to delete");
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
        <h1 className="text-3xl font-bold">Class Teachers</h1>

        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Assign Class Teacher
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Assign Class Teacher</DialogTitle>
            </DialogHeader>
            <AddClassTeacher />
          </DialogContent>

        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search class teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Assigned Class Teachers ({filtered.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((ct) => (
                <TableRow key={ct.id}>

                  <TableCell>
                    {ct.teacher_photo ? (
                      <img src={ct.teacher_photo} alt="Teacher" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      {ct.teacher_name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} />
                      {ct.classroom_name}
                    </div>
                  </TableCell>

                  <TableCell>
                    {ct.academic_year}
                  </TableCell>

                  <TableCell>
                    {ct.teacher_phone || "N/A"}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(ct.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Remove
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