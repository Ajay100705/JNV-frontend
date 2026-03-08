import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

type ClassRoom = {
  id: number;
  class_name: string;
  section: string;
};

type TimeSlot = {
  id: number;
  period_number: number;
};

export default function TimetablePage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [timeslots, setTimeslots] = useState<TimeSlot[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadTimetable();
    }
  }, [selectedClass]);

  const loadInitial = async () => {
    const cls = await api.get("/classes/classrooms/");
    const slots = await api.get("/academic/timeslots/");

    setClasses(cls.data);
    setTimeslots(slots.data);
  };

  const loadTimetable = async () => {
    const res = await api.get(
      `/academic/principal/timetable/class/${selectedClass}/`,
    );
    setTimetable(res.data);
  };

  const getEntry = (day: string, period: number) => {
    return timetable.find(
      (t) =>
        t.day === day &&
        t.time_slot_detail &&
        t.time_slot_detail.period_number === period,
    );
  };

  const deleteTimetable = async () => {
    if (!selectedClass) {
      toast.error("Select class first");
      return;
    }

    if (!confirm("Delete timetable for this class?")) return;

    try {
      await api.delete(
        `/academic/principal/timetable/delete/${selectedClass}/`,
      );

      toast.success("Timetable deleted");

      loadTimetable();
    } catch {
      toast.error("Failed to delete timetable");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Class Timetable</CardTitle>
      </CardHeader>

      <CardContent>
        {/* CLASS DROPDOWN */}

        <div className="mb-6">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Class</option>

            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.class_name} {c.section}
              </option>
            ))}
          </select>
          {!selectedClass && (
            <p className="text-sm text-gray-500 mt-2">
              Please select a class to add timetable
            </p>
          )}
        </div>

        {selectedClass && (
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-2">Period</th>

                {DAYS.map((d) => (
                  <th key={d} className="border p-2">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeslots.map((slot) => (
                <tr key={slot.id}>
                  <td className="border p-2 font-semibold">
                    Period {slot.period_number}
                  </td>

                  {DAYS.map((day) => {
                    const entry = getEntry(day, slot.period_number);

                    return (
                      <td key={day} className="border p-2 text-center">
                        {entry ? (
                          <>
                            <div className="font-medium">
                              {entry.subject_name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {entry.teacher_name}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>

      <div className="flex gap-3">
        <Button
          disabled={!selectedClass}
          variant="destructive"
          className="disabled:bg-gray-300 disabled:text-gray-500"
          onClick={deleteTimetable}
        >
          Delete Timetable
        </Button>

        <Button
          disabled={!selectedClass}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
          onClick={() =>
            navigate(`/principal/add-timetable?class=${selectedClass}`)
          }
        >
          <Plus className="h-4 w-4" />
          Edit Timetable
        </Button>
      </div>
    </Card>
  );
}
