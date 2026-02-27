import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import AddStudent from "@/pages/principal/AddStudent";
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
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

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

  const filtered = students.filter((s) => {
    const matchesSearch =
      `
        ${s.first_name} 
        ${s.last_name}
        ${s.classroom?.class_name || ""}
        ${s.classroom?.section || ""}
        ${s.house?.house_name || ""}
        ${s.house?.house_category || ""}

      `
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesHouse =
      selectedHouse === "all" ||
      s.house?.house_name === selectedHouse;

    const matchesCategory =
      selectedCategory === "all" ||
      s.house?.house_category === selectedCategory;

    const matchesClass =
      selectedClass === "all" ||
      s.classroom?.class_name === selectedClass;

    const matchesSection =
      selectedSection === "all" ||
      s.classroom?.section === selectedSection;

    return (
      matchesSearch &&
      matchesHouse &&
      matchesCategory &&
      matchesClass &&
      matchesSection
    );
  });

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

  const houseOrder = [ "Aravali", "Nilgiri","Shivalik", "Udaygiri"];
  const uniqueHouses = Array.from(
    new Set(
      students
        .map((s) => s.house?.house_name)
        .filter((v): v is string => Boolean(v))
    )
  ).sort((a, b) => {
    const indexA = houseOrder.indexOf(a);
    const indexB = houseOrder.indexOf(b);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  const categoryOrder = ["Junior", "Senior"];
  const uniqueCategories = Array.from(
    new Set(
      students
        .map((s) => s.house?.house_category)
        .filter((v): v is string => Boolean(v))
    )
  ).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  const classOrder = [
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const uniqueClasses = Array.from(
    new Set(
      students
        .map((s) => s.classroom?.class_name?.trim())
        .filter((v): v is string => Boolean(v))
    )
    
  ).sort((a, b) => {
    const indexA = classOrder.indexOf(a);
    const indexB = classOrder.indexOf(b);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
  console.log("uniqueClasses:", uniqueClasses);

  const sectionOrder = ["A", "B"];
  const uniqueSections = Array.from(
    new Set(
      students
        .map((s) => s.classroom?.section)
        .filter((v): v is string => Boolean(v))
    )
  ).sort((a, b) => {
    const indexA = sectionOrder.indexOf(a);
    const indexB = sectionOrder.indexOf(b);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* House Name */}
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Houses</option>
              {uniqueHouses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>

            {/* House Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Class */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}th
                </option>
              ))}
            </select>

            {/* Section */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Sections</option>
              {uniqueSections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

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
                    {student.house?.house_name} - {student.house?.house_category}
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