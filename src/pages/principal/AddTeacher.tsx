import { useState, useEffect} from "react";
import type { ChangeEvent, FormEvent } from "react";
import { addTeacher, updateTeacher } from "../../services/teacherService";
import ImageUploadPreview from "@/components/ImageUploadPreview";

interface TeacherForm {
  username: string;
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
  phone1: string;
  phone2: string;
  subject: string;
  qualification: string;
  date_of_joining: string;
  experience_years?: string;
  photo: File | null;
  present_address?: string;
  permanent_address?: string;
}

interface Props {
  existingTeacher?: any | null;
}

const AddTeacher: React.FC<Props> = ({ existingTeacher }) => {
  const [form, setForm] = useState<TeacherForm>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone1: "",
    phone2: "",
    subject: "",
    qualification: "",
    experience_years: "",
    date_of_joining: "",
    photo: null,
    gender: "",
    present_address: "",
    permanent_address: "",
  });

  // prefill form if existing teacher data is provided
  useEffect(() => {
    if (existingTeacher) {
      setForm({
        username: existingTeacher.username || "",
        first_name: existingTeacher.first_name || "",
        last_name: existingTeacher.last_name || "",
        email: existingTeacher.email || "",
        gender: existingTeacher.gender || "",
        phone1: existingTeacher.phone1 || "",
        phone2: existingTeacher.phone2 || "",
        subject: existingTeacher.subject || "",
        qualification: existingTeacher.qualification || "",
        experience_years: existingTeacher.experience_years || "",
        date_of_joining: existingTeacher.date_of_joining || "",
        photo: null,
        present_address: existingTeacher.present_address || "",
        permanent_address: existingTeacher.permanent_address || "",
      });
    }
  }, [existingTeacher]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file: File) => {
    setForm({ ...form, photo: file });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();

    data.append("username", form.username);
    data.append("first_name", form.first_name);
    data.append("last_name", form.last_name);
    data.append("email", form.email);
    data.append("gender", form.gender);
    data.append("phone1", form.phone1 || "");
    data.append("phone2", form.phone2 || "");
    data.append("subject", form.subject || "");
    data.append("qualification", form.qualification || "");
    data.append("date_of_joining", form.date_of_joining);
    data.append("present_address", form.present_address || "");
    data.append("permanent_address", form.permanent_address || "");

    if (form.experience_years) {
      data.append("experience_years", String(Number(form.experience_years)));
    }

    if (form.photo) {
      data.append("photo", form.photo);
    }

    // Object.entries(form).forEach(([key, value]) => {
    //   if (value && value !== "") {
    //     data.append(key, value);
    //   }
    // });

    try {
      if (existingTeacher) {
        await updateTeacher(existingTeacher.id, data);
        alert("Teacher updated ✅");
      } else {
        await addTeacher(data);
        alert("Teacher added ✅");
}

      window.dispatchEvent(new Event('teacher-added')); // Notify parent component to refresh list

      // reset form
      setForm({
        first_name: "",
        last_name: "",
        username: "",
        gender: "",
        email: "",
        phone1: "",
        phone2: "",
        subject: "",
        qualification: "",
        experience_years: "",
        date_of_joining: "",
        photo: null,
        present_address: "",
        permanent_address: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error adding teacher ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {existingTeacher ? "Edit Teacher" : "Add Teacher"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">

        {/* Photo Upload */}
        <div className="col-span-2 flex justify-center mb-4">
          <ImageUploadPreview 
            onFileSelect={handleFileSelect}
            previewUrl={existingTeacher?.photo || ""} 
          />
        </div>

        {/* First Name */}
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          className="input h-12"
          required
        />

        {/* Last Name */}
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          className="input h-12"
          required
        />

        {/* Username */}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="input h-12"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input h-12"
          required
        />

        {/* Phone1 */}
        <input
          name="phone1"
          placeholder="Phone1"
          value={form.phone1}
          onChange={handleChange}
          className="input h-12"
        />

        {/* Phone2 */}
        <input
          name="phone2"
          placeholder="Phone2"
          value={form.phone2}
          onChange={handleChange}
          className="input h-12"
        />
        


      

        {/* Gender */}
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input h-12"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Subject */}
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="input h-12"
        />

        {/* Qualification */}
        <input
          name="qualification"
          placeholder="Qualification"
          value={form.qualification}
          onChange={handleChange}
          className="input h-12"
        />

        {/* Experience */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700">
            Experience (years)
          </label>
          
          <input
            type="number"
            name="experience_years"
            placeholder="Experience Years"
            value={form.experience_years}
            onChange={handleChange}
            className="input h-12"
            min="0"
            step="1"
          />
        </div>


        {/* Joining Date */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700">
            Joining Date
          </label>

          <input
            type="date"
            name="date_of_joining"
            value={form.date_of_joining}
            onChange={handleChange}
            className="input h-12 w-full"
          />
        </div>

        {/* Present Address */}
        <textarea
          name="present_address"
          placeholder="Present Address"
          value={form.present_address}
          onChange={handleChange}
          className="input h-24 col-span-2"
        />

        {/* Permanent Address */}
        <textarea
          name="permanent_address"
          placeholder="Permanent Address"
          value={form.permanent_address}
          onChange={handleChange}
          className="input h-24 col-span-2"
        />

        {/* Submit */}
        <button type="submit" className="col-span-2 mt-4 bg-blue-600 text-white py-3 rounded-xl">
          {existingTeacher ? "Update Teacher" : "Add Teacher"}
        </button>

      </form>
    </div>
  );
};

export default AddTeacher;
