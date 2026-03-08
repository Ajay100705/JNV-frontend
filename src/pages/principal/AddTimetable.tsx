import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

type Subject = {
  id: number;
  name: string;
};

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
  subject: string;
};

type TimeSlot = {
  id: number;
  period_number: number;
};

type Entry = {
  subject?: number;
  teacher?: number;
};

export default function AddTimetablePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const classId = params.get("class");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [timeslots, setTimeslots] = useState<TimeSlot[]>([]);

  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [originalEntries, setOriginalEntries] = useState<Record<string, Entry>>(
    {},
  );

  useEffect(() => {
    if (!classId) {
      toast.error("Please select class first");
      navigate("/principal/timetable-manager");
      return;
    }

    loadData();
    loadExistingTimetable();
  }, []);

  const loadData = async () => {
    try {
      const sub = await api.get("/academic/subjects/");
      const tea = await api.get("/teachers/");
      const slots = await api.get("/academic/timeslots/");

      setSubjects(sub.data);
      setTeachers(tea.data);
      setTimeslots(slots.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const loadExistingTimetable = async () => {
    try {
      const res = await api.get(
        `/academic/principal/timetable/class/${classId}/`,
      );

      const map: Record<string, Entry> = {};

      res.data.forEach((t: any) => {
        const k = `${t.day}-${t.time_slot_detail.period_number}`;

        map[k] = {
          subject: t.subject,
          teacher: t.teacher,
        };
      });

      setEntries(map);
      setOriginalEntries(map);
    } catch {
      console.log("No previous timetable");
    }
  };

  const key = (day: string, period: number) => `${day}-${period}`;

  const updateEntry = (
    day: string,
    period: number,
    field: "subject" | "teacher",
    value: number,
  ) => {
    const k = key(day, period);

    setEntries((prev) => {
      const updated = {
        ...prev[k],
        [field]: value,
      };

      // reset teacher if subject changes
      if (field === "subject") {
        updated.teacher = undefined;
      }

      // check teacher conflict
      if (field === "teacher") {
        const conflict = Object.entries(prev).find(([key, entry]) => {
          const [d, p] = key.split("-");

          return (
            key !== k &&
            d === day &&
            Number(p) === period &&
            entry.teacher === value
          );
        });

        if (conflict) {
          toast.warning("Teacher already assigned in this period");
        }
      }

      return {
        ...prev,
        [k]: updated,
      };
    });
  };

  const isEdited = (day: string, period: number) => {
    const k = key(day, period);

    const original = originalEntries[k];
    const current = entries[k];

    if (!current) return false;

    // new entry created
    if (!original && (current.subject || current.teacher)) {
      return true;
    }

    // existing entry modified
    if (
      original &&
      (original.subject !== current.subject ||
        original.teacher !== current.teacher)
    ) {
      return true;
    }

    return false;
  };

  const isConflict = (day: string, period: number) => {
    const entry = entries[key(day, period)];
    if (!entry?.teacher) return false;

    // check if teacher already used in another cell same period/day
    const conflicts = Object.entries(entries).filter(([k, v]) => {
      if (!v.teacher) return false;

      const [d, p] = k.split("-");

      return (
        d === day &&
        Number(p) === period &&
        v.teacher === entry.teacher &&
        k !== key(day, period)
      );
    });

    return conflicts.length > 0;
  };

  const saveTimetable = async () => {
    const payload = Object.entries(entries)
      .map(([k, v]) => {
        const [day, period] = k.split("-");

        const slot = timeslots.find((t) => t.period_number === Number(period));

        if (!v.subject || !v.teacher || !slot) return null;

        return {
          classroom: Number(classId),
          day,
          subject: v.subject,
          teacher: v.teacher,
          time_slot: slot.id,
        };
      })
      .filter(Boolean);

    if (payload.length === 0) {
      toast.error("Please fill timetable first");
      return;
    }

    try {
      await api.post("/academic/principal/timetable/bulk-create/", payload);

      toast.success("Timetable saved");

      setTimeout(() => {
        navigate(-1);
      }, 800);

      setOriginalEntries(entries);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e: string) => {
          toast.error(e);
        });
      } else {
        toast.error("Failed to save timetable");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Timetable</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border p-3 text-left">Period</th>

                {DAYS.map((day) => (
                  <th key={day} className="border p-3 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeslots.map((slot) => (
                <tr key={slot.id}>
                  <td className="border p-3 font-semibold bg-gray-100 text-gray-700">
                    Period {slot.period_number}
                  </td>

                  {DAYS.map((day) => {
                    const entry = entries[key(day, slot.period_number)];
                    const exists = originalEntries[key(day, slot.period_number)];
                      
                    const selectedSubject = subjects.find(
                      (s) => s.id === entry?.subject,
                    );

                    const filteredTeachers = teachers.filter(
                      (t) =>
                        selectedSubject && t.subject === selectedSubject.name,
                    );

                    return (
                      <td
                        key={day}
                        className={`border p-2 rounded-sm transition-colors hover:bg-gray-50
                        ${
                          isConflict(day, slot.period_number)
                            ? "bg-red-500 text-white"
                            : isEdited(day, slot.period_number)
                              ? "bg-green-500 text-white"
                              : exists
                                ? "bg-green-100"
                                : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <select
                            value={entry?.subject || ""}
                            onChange={(e) =>
                              updateEntry(
                                day,
                                slot.period_number,
                                "subject",
                                Number(e.target.value),
                              )
                            }
                            className="border rounded px-2 py-1 text-sm bg-white text-black"
                          >
                            <option value="">Select Subject</option>

                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>

                          <select
                            disabled={!entry?.subject}
                            value={entry?.teacher || ""}
                            onChange={(e) =>
                              updateEntry(
                                day,
                                slot.period_number,
                                "teacher",
                                Number(e.target.value),
                              )
                            }
                            className="border rounded px-2 py-1 text-sm bg-white text-black"
                          >
                            <option value="">Select Teacher</option>

                            {filteredTeachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.first_name} {t.last_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            onClick={() => navigate("/principal/timetable-manager")}
          >
            Back
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={saveTimetable}
          >
            Save Timetable
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
