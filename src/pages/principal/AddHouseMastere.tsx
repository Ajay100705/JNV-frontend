import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTeachers, getHouses, assignHouseMaster } from "@/services/houseService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AddHouseMaster: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [teacher, setTeacher] = useState("");
  const [house, setHouse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getTeachers().then(r => {
      console.log("treacher response", r.data);
      setTeachers(r.data || []);
    });
    getHouses().then(r =>{
      console.log("house response", r.data); 
      setHouses(r.data || []);
    });
  }, []);

  const handleSubmit = async () => {
    if (!teacher || !house) {
      toast.error("Select teacher and house");
      return;
    }

    try {
      await assignHouseMaster({
        teacher: Number(teacher),
        house: Number(house),
      });

      toast.success("House Master assigned");
      navigate("/principal/house-masters");

    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Only 2 teachers allowed");
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardContent className="space-y-6 pt-6">

        <h2 className="text-xl font-semibold">Assign House Master</h2>

        <select
          className="w-full h-10 border rounded px-3"
          onChange={(e) => setTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>
              {t.first_name} {t.last_name}
            </option>
          ))}
        </select>

        <select
          className="w-full h-10 border rounded px-3"
          onChange={(e) => setHouse(e.target.value)}
        >
          <option value="">Select House</option>
          {houses.map(h => (
            <option key={h.id} value={h.id}>
              {h.house_name} - {h.house_category}
            </option>
          ))}
        </select>

        <Button className="w-full bg-blue-600" onClick={handleSubmit}>
          Assign
        </Button>

      </CardContent>
    </Card>
  );
};