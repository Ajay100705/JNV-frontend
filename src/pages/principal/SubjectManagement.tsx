import { useEffect, useState } from "react";
import api from "@/api/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const res = await api.get("/academic/subjects/");
    setSubjects(res.data.results || res.data);
  };

  const saveSubject = async () => {
    if (!name || !code) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      await api.put(`/academic/subjects/${editingId}/`, { name, code });
      alert("Subject updated");
    } else {
      await api.post("/academic/subjects/", { name, code });
      alert("Subject created");
    }

    setName("");
    setCode("");
    setEditingId(null);
    loadSubjects();
  };

  const editSubject = (subject: any) => {
    setName(subject.name);
    setCode(subject.code);
    setEditingId(subject.id);
  };

  const deleteSubject = async (id: number) => {
    if (!confirm("Delete this subject?")) return;

    await api.delete(`/academic/subjects/${id}/`);
    loadSubjects();
  };

  return (
    <div className="space-y-6">

      {/* Create Subject */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Subject" : "Create Subject"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Input
            placeholder="Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Subject Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button onClick={saveSubject}>
            {editingId ? "Update Subject" : "Create Subject"}
          </Button>

        </CardContent>
      </Card>

      {/* Subject Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>

        <CardContent>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {subjects.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.code}</TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => editSubject(s)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => deleteSubject(s.id)}
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