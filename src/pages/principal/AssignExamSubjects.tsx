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

export default function AssignExamSubjects() {

  const [exams, setExams] = useState<any[]>([]);
  const [classSubjects, setClassSubjects] = useState<any[]>([]);
  const [examSubjects, setExamSubjects] = useState<any[]>([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const examRes = await api.get("/classes/exams/");
    const classSubjectRes = await api.get("/classes/class-subjects/");
    const examSubjectRes = await api.get("/classes/exam-subjects/");

    setExams(examRes.data.results || examRes.data);
    setClassSubjects(classSubjectRes.data.results || classSubjectRes.data);
    setExamSubjects(examSubjectRes.data.results || examSubjectRes.data);

  };

  const filteredSubjects = classSubjects.filter(
    (cs: any) => cs.class_name === selectedClass
  );

  const filteredExams = exams.filter((e: any) =>
    selectedClass.startsWith(e.class_name)
  );

  const assignExamSubject = async () => {

    if (!selectedClass || !exam || !subject || !totalMarks) {
      alert("Fill all fields");
      return;
    }

    await api.post("/classes/exam-subjects/", {
      exam,
      subject,
      total_marks: Number(totalMarks),
    });

    setExam("");
    setSubject("");
    setTotalMarks("");

    loadData();
  };

  const deleteExamSubject = async (id: number) => {

    if (!confirm("Delete this subject?")) return;

    await api.delete(`/classes/exam-subjects/${id}/`);

    loadData();
  };

  const updateMarks = async (row: any) => {

    const marks = prompt("Enter Total Marks", row.total_marks);

    if (!marks) return;

    await api.patch(`/classes/exam-subjects/${row.id}/`, {
      total_marks: Number(marks),
    });

    loadData();
  };

  /* -------- GROUP BY CLASS -------- */

  const groupedByClass = examSubjects.reduce((acc: any, row: any) => {

    if (!acc[row.class_name]) {
      acc[row.class_name] = [];
    }

    acc[row.class_name].push(row);

    return acc;

  }, {});

  return (

    <div className="space-y-6">

      {/* Assign Form */}

      <Card>

        <CardHeader>
          <CardTitle>Assign Exam Subject</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <select
            className="border p-2 w-full rounded"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>

            {[...new Set(classSubjects.map((c: any) => c.class_name))].map(
              (c: any) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}

          </select>

          <select
            className="border p-2 w-full rounded"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
          >

            <option value="">Select Exam</option>

            {filteredExams.map((e: any) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.class_name})
              </option>
            ))}

          </select>

          <select
            className="border p-2 w-full rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >

            <option value="">Select Subject</option>

            {filteredSubjects.map((s: any) => (
              <option key={s.subject} value={s.subject}>
                {s.subject_name}
              </option>
            ))}

          </select>

          <input
            type="number"
            className="border p-2 w-full rounded"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Enter Total Marks"
          />

          <Button onClick={assignExamSubject}>
            Assign Subject
          </Button>

        </CardContent>

      </Card>


      {/* CLASS WISE TABLES */}

      {Object.entries(groupedByClass).map(([className, rows]: any) => (

        <Card key={className}>

          <CardHeader>
            <CardTitle>Class {className} - Exam Subjects</CardTitle>
          </CardHeader>

          <CardContent>

            <Table>

              <TableHeader>

                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>

              </TableHeader>

              <TableBody>

                {rows.map((row: any) => (

                  <TableRow key={row.id}>

                    <TableCell>{row.exam_name}</TableCell>
                    <TableCell>{row.subject_name}</TableCell>
                    <TableCell>{row.total_marks}</TableCell>

                    <TableCell className="flex gap-2">

                      <Button
                        variant="outline"
                        onClick={() => updateMarks(row)}
                      >
                        Update
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => deleteExamSubject(row.id)}
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

      ))}

    </div>
  );
}