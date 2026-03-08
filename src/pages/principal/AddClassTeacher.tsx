import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import {
  getTeachers,
  getClassRooms,
  assignClassTeacher,
  getClassTeachers,
} from "@/services/academicService";

const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month < 4) {
    return `${year - 1}-${String(year).slice(-2)}`;
  }

  return `${year}-${String(year + 1).slice(-2)}`;
};

export const AddClassTeacher: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [assignedTeacherIds, setAssignedTeacherIds] = useState<number[]>([]);
  const [assignedClassroomIds, setAssignedClassroomIds] = useState<number[]>([]);
  const [teacher, setTeacher] = useState("");
  const [classroom, setClassroom] = useState("");
  const [academicYear] = useState(getCurrentAcademicYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersRes = await getTeachers();
        setTeachers(teachersRes.data || []);

        const classRes = await getClassRooms();
        setClassrooms(classRes.data || []);

        const assignedRes = await getClassTeachers();

        // Extract assigned teacher and classroom IDs to filter out from dropdowns
        const assignedIds = assignedRes.map((ct: any) =>
          Number(ct.teacher)
        );

        const assignedClassroomIds = assignedRes.map((ct: any) =>
          Number(ct.classroom)
        );

        setAssignedClassroomIds(assignedClassroomIds);
        setAssignedTeacherIds(assignedIds);

      } catch (err) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!teacher || !classroom) {
      toast.error("All fields are required");
      return;
    }

    try {
      await assignClassTeacher({
        teacher: Number(teacher),
        classroom: Number(classroom),
        academic_year: academicYear,
      });

      toast.success("Class Teacher Assigned Successfully");

      // Reset form
      setTeacher("");
      setClassroom("");

      // Close dialog & refresh parent
      window.dispatchEvent(new Event("class-teacher-added"));

    } catch (err: any) {
      toast.error(
        err.response?.data?.detail ||
        "Teacher already assigned for this academic year"
      );
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardContent className="space-y-6 pt-6">

        <h2 className="text-xl font-semibold">
          Assign Class Teacher
        </h2>

        {/* Teacher Select */}
        <select
          className="w-full h-10 border rounded px-3"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>

          {teachers
          .sort((a, b) => {
            const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
            const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
            return nameA.localeCompare(nameB);
          })
          .map((t) => {
            const isAssigned = assignedTeacherIds.includes(Number(t.id));

            return (
            <option
                key={t.id}
                value={t.id}
                disabled={isAssigned}
            >
                {t.first_name} {t.last_name} {t.subject ? ` - ${t.subject}` : ""}
                {isAssigned ? " (Already Assigned)" : ""}
            </option>
            );
        })}
        </select>

        {/* Class Select */}
        <select
        className="w-full h-10 border rounded px-3"
        value={classroom}
        onChange={(e) => setClassroom(e.target.value)}
        >
        <option value="">Select Class</option>

        {classrooms.map((c) => {
            const isAssigned = assignedClassroomIds.includes(Number(c.id));

            return (
            <option
                key={c.id}
                value={c.id}
                disabled={isAssigned}
            >
                {c.class_name} - {c.section}
                {isAssigned ? " (Already Assigned)" : ""}
            </option>
            );
        })}
        </select>

        {/* Academic Year */}
        <input
          type="text"
          className="w-full h-10 border rounded px-3 bg-gray-100"
          value={academicYear}
          readOnly
        />

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Assign
        </Button>

      </CardContent>
    </Card>
  );
};