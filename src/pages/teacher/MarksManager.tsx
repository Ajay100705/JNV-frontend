import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MarksManager() {

  const navigate = useNavigate();

  const [students,setStudents] = useState<any[]>([]);
  const [subjects,setSubjects] = useState<any[]>([]);
  const [examName,setExamName] = useState("");

  const [exams,setExams] = useState<any[]>([]);
  const [selectedExam,setSelectedExam] = useState("");
  const [selectedSubject,setSelectedSubject] = useState("");

  const [open,setOpen] = useState(false);

  useEffect(()=>{
    loadData()
  },[])

  const loadData = async ()=>{

    try{

      const res = await api.get("/classes/student-marks/marks-overview/")

      setStudents(res.data.students || [])
      setSubjects(res.data.subjects || [])
      setExamName(res.data.exam || "")
      setExams(res.data.exams || [])

    }
    catch(err){
      console.error("Failed to load marks overview",err)
    }

  }

  const startEntry = ()=>{

    if(!selectedExam || !selectedSubject){
      alert("Please select both exam and subject")
      return;
    }

    setOpen(false)

    navigate(`/classes/enter-marks/${selectedExam}/${selectedSubject}`)

  }

  const closeDialog = ()=>{
    setOpen(false)
    setSelectedExam("")
    setSelectedSubject("")
  }

  return(

    <>

    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Latest Exam Marks ({examName})
        </CardTitle>

        <Button onClick={()=>setOpen(true)}>
          Enter Marks
        </Button>

      </CardHeader>

      <CardContent>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Photo</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Admission</TableHead>

              {subjects.map((sub:any)=>(
                <TableHead key={sub}>
                  {sub}
                </TableHead>
              ))}

            </TableRow>

          </TableHeader>

          <TableBody>

            {students.map((student:any)=>(

              <TableRow key={student.id}>

                <TableCell>

                  {student.photo ? (

                    <img
                      src={
                        student.photo.startsWith("http")
                        ? student.photo
                        : `http://127.0.0.1:8000${student.photo}`
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />

                  ) : (

                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      {student.name?.charAt(0)?.toUpperCase()}
                    </div>

                  )}

                </TableCell>

                <TableCell className="font-medium">
                  {student.name}
                </TableCell>

                <TableCell>
                  {student.admission_number}
                </TableCell>

                {subjects.map((sub:any)=>(
                  <TableCell key={sub} className="text-center">
                    {student.marks?.[sub] ?? "-"}
                  </TableCell>
                ))}

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </CardContent>

    </Card>


    {/* MARKS ENTRY DIALOG */}

    <Dialog open={open} onOpenChange={closeDialog}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>Select Exam & Subject</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Exam */}

          <div>

            <label className="text-sm font-medium">
              Exam
            </label>

            <select
              value={selectedExam}
              onChange={(e)=>setSelectedExam(e.target.value)}
              className="border rounded-md p-2 w-full mt-1"
            >

              <option value="">Select Exam</option>

              {exams.map((e:any)=>(
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}

            </select>

          </div>

          {/* Subject */}

          <div>

            <label className="text-sm font-medium">
              Subject
            </label>

            <select
              value={selectedSubject}
              onChange={(e)=>setSelectedSubject(e.target.value)}
              className="border rounded-md p-2 w-full mt-1"
            >

              <option value="">Select Subject</option>

              {subjects.map((s:any)=>(
                <option key={s} value={s}>
                  {s}
                </option>
              ))}

            </select>

          </div>

          <Button
            className="w-full"
            disabled={!selectedExam || !selectedSubject}
            onClick={startEntry}
          >
            Start Marks Entry
          </Button>

        </div>

      </DialogContent>

    </Dialog>

    </>

  )

}