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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ExamManager() {

  const [classes,setClasses] = useState<any[]>([])
  const [exams,setExams] = useState<any[]>([])

  const [openCreate,setOpenCreate] = useState(false)
  const [openBulk,setOpenBulk] = useState(false)
  const [openUpdate,setOpenUpdate] = useState(false)

  const [editExamId,setEditExamId] = useState<number | null>(null)

  const [className,setClassName] = useState("")
  const [name,setName] = useState("")
  const [weightage,setWeightage] = useState("")
  const [academicYear,setAcademicYear] = useState("")
  const [startDate,setStartDate] = useState("")
  const [endDate,setEndDate] = useState("")

  useEffect(()=>{
    loadData()
  },[])

  const loadData = async ()=>{

    const classesRes = await api.get("/classes/classrooms")
    const examsRes = await api.get("/classes/exams/")

    const classData = classesRes.data.results || classesRes.data

    const uniqueClasses = [...new Set(classData.map((c:any)=>c.class_name))]

    setClasses(uniqueClasses)
    setExams(examsRes.data.results || examsRes.data)

  }

  const createExam = async ()=>{

    await api.post("/classes/create-exam/",{
      class_name:className,
      name,
      weightage,
      academic_year:academicYear,
      start_date:startDate,
      end_date:endDate
    })

    setOpenCreate(false)
    loadData()

  }

  const bulkCreate = async ()=>{

    await api.post("/classes/bulk-create-exams/",{
      name,
      weightage,
      academic_year:academicYear,
      start_date:startDate,
      end_date:endDate
    })

    setOpenBulk(false)
    loadData()

  }

  const deleteExam = async (id:number)=>{

    if(!confirm("Delete this exam?")) return

    await api.delete(`/classes/delete-exam/${id}/`)

    loadData()

  }

  const deleteExamType = async (examName:string)=>{

    if(!confirm(`Delete ${examName} for all classes?`)) return

    await api.delete(`/classes/delete-exam-type/${examName}/`)

    loadData()

  }

  const openUpdateForm = (exam:any)=>{

    setEditExamId(exam.id)

    setWeightage(exam.weightage)
    setStartDate(exam.start_date)
    setEndDate(exam.end_date)

    setOpenUpdate(true)

  }

  const updateSingleExam = async ()=>{

    if(!editExamId) return

    const payload:any = {}

    if(weightage) payload.weightage = weightage
    if(startDate) payload.start_date = startDate
    if(endDate) payload.end_date = endDate

    await api.put(`/classes/update-single-exam/${editExamId}/`,payload)

    setOpenUpdate(false)

    loadData()

  }

  const updateExamType = async (examName:string)=>{

    const payload:any = {}

    if(weightage) payload.weightage = weightage
    if(startDate) payload.start_date = startDate
    if(endDate) payload.end_date = endDate

    await api.put(`/classes/update-exam-type/${examName}/`,payload)

    loadData()

  }

  const groupedExams = exams.reduce((acc:any,exam:any)=>{

    if(!acc[exam.name]){
      acc[exam.name] = []
    }

    acc[exam.name].push(exam)

    return acc

  },{})

  return(

<Card>

<CardHeader className="flex justify-between items-center">

<CardTitle>Exam Management</CardTitle>

<div className="flex gap-2">

<Button onClick={()=>setOpenCreate(true)}>
Create Exam
</Button>

<Button variant="outline" onClick={()=>setOpenBulk(true)}>
Bulk Create
</Button>

</div>

</CardHeader>


{Object.entries(groupedExams).map(([examName,examList]:any)=>{

const first = examList[0]

return(

<Card key={examName} className="mb-6 border">

<CardHeader className="flex justify-between items-center">

<CardTitle>{examName}</CardTitle>

<div className="flex gap-2">

<Button
variant="outline"
size="sm"
onClick={()=>openUpdateForm(first)}
>
Update
</Button>

<Button
variant="destructive"
size="sm"
onClick={()=>deleteExamType(examName)}
>
Delete
</Button>

</div>

</CardHeader>

<CardContent>

<Table>

<TableHeader>

<TableRow>

<TableHead>Class</TableHead>
<TableHead>Academic Year</TableHead>
<TableHead>Weightage</TableHead>
<TableHead>Start</TableHead>
<TableHead>End</TableHead>
<TableHead>Actions</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{examList.map((e:any)=>(

<TableRow key={e.id}>

<TableCell>Class {e.class_name}</TableCell>

<TableCell>{e.academic_year}</TableCell>

<TableCell>{e.weightage}%</TableCell>

<TableCell>{e.start_date}</TableCell>

<TableCell>{e.end_date}</TableCell>

<TableCell className="flex gap-2">

<Button
size="sm"
variant="outline"
onClick={()=>openUpdateForm(e)}
>
Update
</Button>

<Button
size="sm"
variant="destructive"
onClick={()=>deleteExam(e.id)}
>
Delete
</Button>

</TableCell>

</TableRow>

))}

</TableBody>

</Table>

<div className="flex gap-3 mt-4 justify-end">

<Button
variant="outline"
onClick={()=>updateExamType(examName)}
>
Update All {examName}
</Button>

<Button
variant="destructive"
onClick={()=>deleteExamType(examName)}
>
Delete All {examName}
</Button>

</div>

</CardContent>

</Card>

)

})}


{/* UPDATE DIALOG */}

<Dialog open={openUpdate} onOpenChange={setOpenUpdate}>

<DialogContent>

<DialogHeader>
<DialogTitle>Update Exam</DialogTitle>
</DialogHeader>

<div className="space-y-3">

<input
value={weightage}
onChange={(e)=>setWeightage(e.target.value)}
placeholder="Weightage"
className="border p-2 w-full"
/>

<input
type="date"
value={startDate}
onChange={(e)=>setStartDate(e.target.value)}
className="border p-2 w-full"
/>

<input
type="date"
value={endDate}
onChange={(e)=>setEndDate(e.target.value)}
className="border p-2 w-full"
/>

<Button
className="w-full"
onClick={updateSingleExam}
>
Update Exam
</Button>

</div>

</DialogContent>

</Dialog>


{/* CREATE DIALOG */}

<Dialog open={openCreate} onOpenChange={setOpenCreate}>

<DialogContent>

<DialogHeader>
<DialogTitle>Create Exam</DialogTitle>
</DialogHeader>

<div className="space-y-3">

<select
className="border p-2 w-full"
onChange={(e)=>setClassName(e.target.value)}
>

<option>Select Class</option>

{classes.map((c:any)=>(
<option key={c} value={c}>
Class {c}
</option>
))}

</select>

<select
className="border p-2 w-full"
onChange={(e)=>setName(e.target.value)}
>

<option>Select Exam</option>

<option value="UNIT1">Unit Test 1</option>
<option value="UNIT2">Unit Test 2</option>
<option value="MIDTERM">Mid Term</option>
<option value="UNIT3">Unit Test 3</option>
<option value="UNIT4">Unit Test 4</option>
<option value="ENDTERM">End Term</option>

</select>

<input
placeholder="Weightage"
className="border p-2 w-full"
onChange={(e)=>setWeightage(e.target.value)}
/>

<input
placeholder="Academic Year"
className="border p-2 w-full"
onChange={(e)=>setAcademicYear(e.target.value)}
/>

<input
type="date"
className="border p-2 w-full"
onChange={(e)=>setStartDate(e.target.value)}
/>

<input
type="date"
className="border p-2 w-full"
onChange={(e)=>setEndDate(e.target.value)}
/>

<Button
className="w-full"
onClick={createExam}
>
Create Exam
</Button>

</div>

</DialogContent>

</Dialog>


{/* BULK CREATE */}

<Dialog open={openBulk} onOpenChange={setOpenBulk}>

<DialogContent>

<DialogHeader>
<DialogTitle>Create Exam For All Classes</DialogTitle>
</DialogHeader>

<div className="space-y-3">

<select
className="border p-2 w-full"
onChange={(e)=>setName(e.target.value)}
>

<option>Select Exam</option>

<option value="UNIT1">Unit Test 1</option>
<option value="UNIT2">Unit Test 2</option>
<option value="MIDTERM">Mid Term</option>
<option value="UNIT3">Unit Test 3</option>
<option value="UNIT4">Unit Test 4</option>
<option value="ENDTERM">End Term</option>

</select>

<input
placeholder="Academic Year"
className="border p-2 w-full"
onChange={(e)=>setAcademicYear(e.target.value)}
/>

<input
placeholder="Weightage"
className="border p-2 w-full"
onChange={(e)=>setWeightage(e.target.value)}
/>

<input
type="date"
className="border p-2 w-full"
onChange={(e)=>setStartDate(e.target.value)}
/>

<input
type="date"
className="border p-2 w-full"
onChange={(e)=>setEndDate(e.target.value)}
/>

<Button
className="w-full"
onClick={bulkCreate}
>
Create Exam For All Classes
</Button>

</div>

</DialogContent>

</Dialog>

</Card>

)

}