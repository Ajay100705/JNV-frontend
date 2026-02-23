import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import AddStudent from "@/pages/parent/AddStudent";
import { getStudents, deleteStudent } from "@/services/studentService";
import type { Student } from "@/types";

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
  GraduationCap,
  Home,
  User,
} from "lucide-react";

import { toast } from "sonner";

const houseStyle = (house?: string) => {
  switch (house) {
    case "Shivalik":
      return "bg-red-100 text-red-600 border-red-200";
    case "Aravali":
      return "bg-blue-100 text-blue-600 border-blue-200";
    case "Nilgiri":
      return "bg-green-100 text-green-600 border-green-200";
    case "Udaygiri":
      return "bg-yellow-100 text-yellow-600 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export const PrincipalStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();

    const refresh = () => {
      setOpen(false);
      loadStudents();
    };

    window.addEventListener("student-added", refresh);
    return () => window.removeEventListener("student-added", refresh);
  }, []);

  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const remove = async (id: number) => {
    if (!confirm("Delete student?")) return;

    await deleteStudent(id);
    toast.success("Student deleted");
    loadStudents();
  };

  if (loading)
    return (
      <div className="flex justify-center h-[60vh] items-center">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Students</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Add Student
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0">
            <AddStudent />
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filtered.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Parent Phone</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            {/* EDIT STUDENT MODAL */}
            <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
              <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                <AddStudent existingStudent={editStudent} />
              </DialogContent>
            </Dialog>

            <TableBody>

            {filtered.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  {student.photo ? (
                    <img src={student.photo} alt="Student" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {student.first_name} {student.last_name}
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  <GraduationCap size={14} />
                  {student.classroom?.class_name} {student.classroom?.section}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${houseStyle(student.house?.house_name)} px-3 py-1 rounded-full`}
                  >
                    <Home size={12} className="mr-1" />
                    {student.house?.house_name}
                  </Badge>
                </TableCell>

                <TableCell>{student.parent?.phone1 || "-"}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setEditStudent(student)}
                      >
                        <Edit size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => remove(student.id)}
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