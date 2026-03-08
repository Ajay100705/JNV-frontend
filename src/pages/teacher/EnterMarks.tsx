import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  admission_number: string;
  marks?: number;
}

export default function EnterMarks() {

  const { examId, subjectId } = useParams();

  const [students,setStudents] = useState<Student[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    loadStudents();
  },[]);

  const loadStudents = async () => {

    try{

      const res = await api.get(
        `/classes/student-marks/class-students/?exam=${examId}&subject=${subjectId}`
      );

      const sorted = (res.data.students || []).sort((a:any,b:any)=>
        a.name.localeCompare(b.name)
      );

      setStudents(sorted);

    }catch{
      toast.error("Failed to load students");
    }
    finally{
      setLoading(false);
    }

  };

  const updateMarks = (studentId:number,value:number)=>{

    setStudents(prev=>
      prev.map(s=>
        s.id===studentId
        ? {...s,marks:value}
        : s
      )
    );

  };

  const saveMarks = async () =>{

    try{

      const payload = {

        subject_exam: subjectId,

        marks: students.map(s=>({

          student_id:s.id,
          marks:s.marks || 0

        }))

      };

      await api.post(
        "/classes/student-marks/enter-marks/",
        payload
      );

      toast.success("Marks saved successfully");

    }
    catch{
      toast.error("Failed to save marks");
    }

  };

  if(loading)
  return(
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner/>
    </div>
  );

  return(

    <Card>

      <CardHeader>
        <CardTitle>Enter Marks</CardTitle>
      </CardHeader>

      <CardContent>

        <table className="w-full">

          <thead>
            <tr>
              <th className="text-left">Student</th>
              <th className="text-left">Admission</th>
              <th className="text-left">Marks</th>
            </tr>
          </thead>

          <tbody>

            {students.map((student)=>(

              <tr key={student.id} className="border-b">

                <td className="py-2">{student.name}</td>

                <td>{student.admission_number}</td>

                <td>

                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-24"
                    value={student.marks ?? ""}
                    onChange={(e)=>updateMarks(
                      student.id,
                      Number(e.target.value)
                    )}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <Button
          className="mt-6"
          onClick={saveMarks}
        >
          Save Marks
        </Button>

      </CardContent>

    </Card>

  );

}