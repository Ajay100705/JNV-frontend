import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { addStudent, updateStudent } from "@/services/studentService";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import type { Student } from "@/types";

type Tab = "student" | "parent";


interface Props {
  existingStudent?: Student | null;
}

interface StudentForm {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;

  class_name: string;
  section: string;
  house_name: string;
  house_category: string;

  admission_date: string;
  date_of_birth: string;

  parent_first_name: string;
  parent_last_name: string;
  parent_phone1: string;
  parent_phone2: string;
  parent_email: string;
  parent_job: string;
  present_address: string;
  permanent_address: string;

  photo: File | null;
  parent_photo: File | null;
}

export default function AddStudent({ existingStudent }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("student");

  /* ---------- Static dropdown values ---------- */

  const classes = ["6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B"];

  // FIXED houses array
  const houses = ["Aravali", "Nilgiri", "Shivalik", "Udaygiri"];

  /* ---------- Form State ---------- */

  const [form, setForm] = useState<StudentForm>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "",

    class_name: "",
    section: "",
    house_name: "",
    house_category: "",

    admission_date: "",
    date_of_birth: "",

    parent_first_name: "",
    parent_last_name: "",
    parent_phone1: "",
    parent_phone2: "",
    parent_email: "",
    parent_job: "",
    present_address: "",
    permanent_address: "",

    photo: null,
    parent_photo: null,
  });

  /* ---------- PREFILL WHEN EDITING ---------- */

  useEffect(() => {
    if (!existingStudent) return;

    setForm({
      username: existingStudent.username || "",
      first_name: existingStudent.first_name || "",
      last_name: existingStudent.last_name || "",
      email: existingStudent.email || "",
      gender: existingStudent.gender || "",

      class_name: existingStudent.classroom?.class_name || "",
      section: existingStudent.classroom?.section || "",

      house_name: existingStudent.house?.house_name || "",
      house_category: existingStudent.house?.house_category || "",

      admission_date: existingStudent.admission_date || "",
      date_of_birth: existingStudent.date_of_birth || "",

      parent_first_name: existingStudent.parent?.first_name || "",
      parent_last_name: existingStudent.parent?.last_name || "",
      parent_phone1: existingStudent.parent?.phone1 || "",
      parent_phone2: existingStudent.parent?.phone2 || "",
      parent_email: existingStudent.parent?.email || "",
      parent_job: existingStudent.parent?.job || "",

      present_address: existingStudent.parent?.present_address || "",
      permanent_address: existingStudent.parent?.permanent_address || "",

      photo: null,
      parent_photo: null,
    });
  }, [existingStudent]);

  useEffect(() => {
  if (form.class_name) {
    handleClassChange(form.class_name);
  }
}, [form.class_name]);


  /* ---------- Auto house category based on class ---------- */

  const handleClassChange = (value: string) => {
    let category = "";

    const num = parseInt(value);

    if (num >= 6 && num <= 8) category = "Junior";
    else if (num >= 9) category = "Senior";

    setForm({ ...form, class_name: value, house_category: category });
  };

  /* ---------- Input handlers ---------- */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentPhoto = (file: File) =>
    setForm({ ...form, photo: file });

  const handleParentPhoto = (file: File) =>
    setForm({ ...form, parent_photo: file });

  /* ---------- Submit ---------- */

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v as any);
    });

    try {
      if (existingStudent) {
        await updateStudent(existingStudent.id, data);
        alert("Student updated");
      } else {
        await addStudent(data);
        alert("Student added");
      }

      window.dispatchEvent(new Event("student-added"));
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  /* ---------- JSX ---------- */

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center py-4">
        {existingStudent ? "Edit Student" : "Add Student"}
      </h2>

      {/* TABS */}
      <div className="flex border-b">
        {["student", "parent"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t as Tab)}
            className={`flex-1 py-3 font-medium ${
              activeTab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-400"
            }`}
          >
            {t === "student" ? "Student Details" : "Parent Details"}
          </button>
        ))}
      </div>

      {/* FORM BODY */}
      <div className="p-6">

        {/* STUDENT TAB */}
        {activeTab === "student" && (
          <div className="grid grid-cols-2 gap-5">

            <div className="col-span-2 flex justify-center">
              <ImageUploadPreview 
                previewUrl={existingStudent?.photo}
                onFileSelect={handleStudentPhoto} 
              />
            </div>

            <input name="first_name" placeholder="First Name" className="input h-12" onChange={handleChange} value={form.first_name} />
            <input name="last_name" placeholder="Last Name" className="input h-12" onChange={handleChange} value={form.last_name} />

            <input name="username" placeholder="Username" className="input h-12" onChange={handleChange} value={form.username} />

            <input name="email" placeholder="Email" className="input h-12" onChange={handleChange} value={form.email} />

            <select name="gender" value={form.gender} onChange={handleChange} className="input h-12">
              <option value="" disabled>Select Gender</option>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select 
              name="class_name"
              value={form.class_name} 
              onChange={(e) => handleClassChange(e.target.value)}
              className="input h-12"
              required
            >
              <option value="" disabled>Select Class</option>
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>

            <select 
              name="section" 
              value={form.section} onChange={handleChange} 
              className="input h-12"
              required
            >
              <option value="" disabled>Select Section</option>
              {sections.map(s => <option key={s}>{s}</option>)}
            </select>

            <select 
              name="house_name" 
              value={form.house_name} onChange={handleChange} 
              className="input h-12"
              required
            >
            <option value="" disabled>Select House</option>
            {houses.map(h => <option key={h}>{h}</option>)}
          </select>

            <input readOnly className="input h-12 bg-gray-100" value={form.house_category} />

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                Admission Date
              </label>

              <input
                type="date"
                name="admission_date"
                value={form.admission_date}
                onChange={handleChange}
                className="input h-12 w-full"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                Date of Birth
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="input h-12 w-full"
              />
            </div>


            <button type="button" onClick={() => setActiveTab("parent")} className="col-span-2 bg-blue-600 text-white py-3 rounded-xl">
              Next →
            </button>
          </div>
        )}

        {/* PARENT TAB */}
        {activeTab === "parent" && (
          <div className="grid grid-cols-2 gap-5">

            <div className="col-span-2 flex justify-center">
              <ImageUploadPreview 
                onFileSelect={handleParentPhoto} 
                previewUrl={existingStudent?.parent?.photo}
              />
            </div>

            <input name="parent_first_name" placeholder="First Name" className="input h-12" onChange={handleChange} value={form.parent_first_name} />
            <input name="parent_last_name" placeholder="Last Name" className="input h-12" onChange={handleChange} value={form.parent_last_name} />

            <input name="parent_phone1" placeholder="Phone" className="input h-12" onChange={handleChange} value={form.parent_phone1} />

            <textarea name="present_address" placeholder="Present Address" className="input col-span-2" onChange={handleChange} value={form.present_address || ""} />
            <textarea name="permanent_address" placeholder="Permanent Address" className="input col-span-2" onChange={handleChange} value={form.permanent_address || ""} />

            <div className="col-span-2 flex gap-3">
              <button type="button" onClick={() => setActiveTab("student")} className="flex-1 border py-3 rounded-xl">
                ← Back
              </button>

              <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl">
                Save Student
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}