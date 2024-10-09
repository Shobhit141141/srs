"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Table } from "@radix-ui/themes";
import Loader from "@/ui/Loader";
import { Chip, Input } from "@nextui-org/react";
import { LogInIcon, SearchIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useApi, { getAllStudents } from "@/apis/api";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeSlotFilter, setTimeSlotFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { teacher } = useAuth();

  const { getAllStudents } = useApi();
  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      console.log(response);
      setStudents(response);
      setFilteredStudents(response);
    } catch (error) {
      setError(`Error fetching students: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchStudents();
  }, []);

  useEffect(() => {
    let updatedStudents = students;

    // Apply status filter
    if (statusFilter === "active") {
      updatedStudents = updatedStudents.filter((student) => student.isActive);
    } else if (statusFilter === "inactive") {
      updatedStudents = updatedStudents.filter((student) => !student.isActive);
    }

    // Apply time slot filter
    if (timeSlotFilter) {
      updatedStudents = updatedStudents.filter(
        (student) => student.timeSlot === timeSlotFilter
      );
    }

    // Apply search query filter
    if (searchQuery) {
      updatedStudents = updatedStudents.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by time slot
    updatedStudents?.sort((a, b) => (a.timeSlot > b.timeSlot ? 1 : -1));

    setFilteredStudents(updatedStudents);
  }, [statusFilter, timeSlotFilter, searchQuery, students]);
  if (loading) {
    return <Loader />;
  }
  // if (error) return <p className="text-red-500">{error}</p>;

  const uniqueTimeSlots = [
    ...new Set(students?.map((student) => student.timeSlot)),
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        Welcome <span className="text-yellow-400">🎉 {teacher?.username}</span>
      </h1>

      <h1 className="text-2xl font-bold my-6 text-blue-500">All Students</h1>

      {/* Filter Section */}
      <div className="mb-4">
        <label className="mr-2">Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="active" className="text-green-400">
            Active
          </option>
          <option value="inactive" className="text-red-500">
            Inactive
          </option>
        </select>

        <label className="mr-2 ml-4">Time Slot:</label>
        <select
          value={timeSlotFilter}
          onChange={(e) => setTimeSlotFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          {Array.from({ length: 14 }, (_, index) => {
            const hour = 7 + index; // Starting from 7 AM
            const ampm = hour < 12 ? "AM" : "PM";
            const displayHour = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
            const timeSlot = `${displayHour} - ${
              (displayHour % 12) + 1
            } ${ampm}`;

            return (
              <option
                key={index}
                value={timeSlot}
                className={`${hour < 12 ? "text-orange-400" : "text-sky-400"}`}
              >
                {timeSlot}
              </option>
            );
          })}
        </select>
      </div>

      <Input
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            "my-4",
          ],
        }}
        placeholder="Type to search..."
        startContent={<SearchIcon className="scale-[0.8]" />}
        value={searchQuery} // Bind the search query state
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredStudents?.length === 0 ? (
        <div className="border rounded-lg shadow-sm p-4 my-4 bg-red-700 font-bold text-center">
          No Student found
        </div>
      ) : (
        <Table.Root
          className="min-w-full border-collapse border border-gray-500 rounded-md mt-4"
          variant="surface"
        >
          <Table.Header>
            <Table.Row className="text-yellow-400">
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Time Slot</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              {/* <Table.ColumnHeaderCell>Visit</Table.ColumnHeaderCell> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredStudents?.map((student, index) => (
              <Table.Row key={student.id} className="cursor-pointer">
                <Table.ColumnHeaderCell>{index + 1}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hover:text-blue-400 hover:underline">
                  <Link href={`/student/${student.id}`}>{student.name}</Link>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  {student.timeSlot}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Chip
                    color={`${student.isActive ? "success" : "danger"}`}
                    variant="flat"
                  >
                    {student.isActive ? "Active" : "Inactive"}
                  </Chip>
                </Table.ColumnHeaderCell>
                {/* <Table.ColumnHeaderCell>
                  <Link href={`/student/${student.id}`}>
                    <p className="text-blue-500 underline flex items-center gap-2">
                      <Link1Icon /> Visit
                    </p>
                  </Link>
                </Table.ColumnHeaderCell> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
};

export default StudentsPage;
