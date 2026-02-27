import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { HouseMaster } from "@/types";
import { getHouseMasters, deleteHouseMaster } from "@/services/houseService";
import {AddHouseMaster} from "@/pages/principal/AddHouseMastere";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Plus,
  MoreVertical,
  // Edit,
  Trash2,
  Mail,
  Home,
  User,
} from "lucide-react";

import { toast } from "sonner";

export const PrincipalHouseMasters: React.FC = () => {
  const [houseMasters, setHouseMasters] = useState<HouseMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedHouseName, setSelectedHouseName] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchHouseMasters();
    console.log("HOUSE MASTERS:", houseMasters);

    const refresh = async () => {
      setOpen(false);
      await fetchHouseMasters();
      console.log("HOUSE MASTERS:", houseMasters);
    };

    window.addEventListener("housemaster-added", refresh);

    return () => window.removeEventListener("housemaster-added", refresh);
  }, []);

  const fetchHouseMasters = async () => {
    try {
      const res = await getHouseMasters();
      setHouseMasters(res.data);
    } catch {
      toast.error("Failed to fetch house masters");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = houseMasters.filter((hm) => {
    const name =
      `${hm.teacher_detail?.first_name || ""} ${hm.teacher_detail?.last_name || ""}`.toLowerCase();

    const houseName = hm.house_detail?.house_name || "";
    const category = hm.house_detail?.house_category || "";

    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      houseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHouseName =
      selectedHouseName === "all" || houseName === selectedHouseName;

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    return matchesSearch && matchesHouseName && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove house master?")) return;

    try {
      await deleteHouseMaster(id);
      await fetchHouseMasters();
      toast.success("House master removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  const houseStyle = (house?: string) => {
    switch (house) {
      case "Shivalik":
        return "bg-red-100 text-red-600 border-red-200";
      case "Aravali":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "Nilgiri":
        return "bg-green-100 text-green-600 border-green-200";
      case "Udaygiri":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const uniqueHousesName = Array.from(
    new Set(
      houseMasters.map((hm) => hm.house_detail?.house_name).filter(Boolean)
    )
  );

  const uniqueCategories = Array.from(
    new Set(
      houseMasters.map((hm) => hm.house_detail?.house_category).filter(Boolean)
    )
  );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">House Masters</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Assign House Master
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl">
            <AddHouseMaster />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col md:flex-row">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* House Name Dropdown */}
            <select
              className="border rounded-md px-3 py-2 text-sm bg-white"
              value={selectedHouseName}
              onChange={(e) => setSelectedHouseName(e.target.value)}
            >
              <option value="all">All Houses</option>
              {uniqueHousesName.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>

            {/* Category Dropdown */}
            <select
              className="border rounded-md px-3 py-2 text-sm bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>House Masters ({filtered.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 ">
                <TableHead>Photo</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((hm) => (
                <TableRow key={hm.id}>

                  <TableCell>
                    {hm.teacher_detail?.photo ? (
                      <img src={hm.teacher_detail.photo} alt="Teacher" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                        )}
                  </TableCell>

                  <TableCell>
                    {hm.teacher_detail?.first_name} {hm.teacher_detail?.last_name}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium
                          ${houseStyle(hm.house_detail?.house_name)}`}
                      >
                        <Home size={14} />
                        {hm.house_detail?.house_name} - {hm.house_detail?.house_category}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{hm.teacher_detail?.phone1 || "N/A"}</TableCell>
                    

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Mail size={14} className="mr-2" /> Email
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(hm.id)}
                        >
                          <Trash2 size={14} className="mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};