import { useEffect, useState } from "react";
import api from "@/api/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AssignClassSubjects() {

  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classSubjects, setClassSubjects] = useState<any[]>([]);

  const [classroom, setClassroom] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const classesRes = await api.get("/classes/classrooms/");
    const subjectsRes = await api.get("/academic/subjects/");
    const classSubjectsRes = await api.get("/classes/class-subjects/");

    setClasses(classesRes.data.results || classesRes.data);
    setSubjects(subjectsRes.data.results || subjectsRes.data);
    setClassSubjects(classSubjectsRes.data.results || classSubjectsRes.data);
  };

  const toggleSubject = (id: number) => {

    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }

  };

  const assignSubjects = async () => {

    if (!classroom) {
      alert("Select class");
      return;
    }

    try {

      setLoading(true);

      await api.post("/classes/class-subjects/assign_subjects/", {
        classroom,
        subjects: selectedSubjects
      });

      setSelectedSubjects([]);
      setClassroom("");

      loadData();

    } catch (e) {
      alert("Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: number) => {

    if (!confirm("Remove this subject from class?")) return;

    await api.delete(`/classes/class-subjects/${id}/`);

    loadData();
  };

  const toggleExamSubject = async (row: any) => {

    await api.patch(`/classes/class-subjects/${row.id}/`, {
      is_exam_subject: !row.is_exam_subject
    });

    loadData();
  };

  return (
    <div className="space-y-6">

      {/* Assign Subjects */}

      <Card>
        <CardHeader>
          <CardTitle>Assign Subjects To Class</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <select
            value={classroom}
            className="border p-2 w-full rounded"
            onChange={(e) => setClassroom(e.target.value)}
          >

            <option value="">Select Class</option>

            {classes.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.class_name}-{c.section}
              </option>
            ))}

          </select>

          <div className="grid grid-cols-3 gap-2 border p-3 rounded">

            {subjects.map((s: any) => (

              <label key={s.id} className="flex gap-2 items-center">

                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(s.id)}
                  onChange={() => toggleSubject(s.id)}
                />

                {s.name}

              </label>

            ))}

          </div>

          <Button
            className="w-full"
            onClick={assignSubjects}
            disabled={loading}
          >
            {loading ? "Assigning..." : "Assign Subjects"}
          </Button>

        </CardContent>
      </Card>


      {/* Assigned Subjects Table */}

      <Card>

        <CardHeader>
          <CardTitle>Class Subjects</CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Subject</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {classSubjects.map((row: any) => (

                <TableRow key={row.id}>

                  <TableCell>{row.class_name}</TableCell>

                  <TableCell>{row.subject_name}</TableCell>

                  <TableCell>

                    <input
                      type="checkbox"
                      checked={row.is_exam_subject}
                      onChange={() => toggleExamSubject(row)}
                    />

                  </TableCell>

                  <TableCell>

                    <Button
                      variant="destructive"
                      onClick={() => deleteAssignment(row.id)}
                    >
                      Delete
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  );
}