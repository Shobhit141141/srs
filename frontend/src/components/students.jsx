"use client";
import { useEffect, useState } from "react";
import client from "@/utils/graphql"; // Adjust the path as necessary
import Link from "next/link";
import { Table } from "@radix-ui/themes";
import { Link1Icon } from "@radix-ui/react-icons";
import Loader from "@/ui/Loader";

const GET_ALL_STUDENTS_QUERY = `
  query {
    getAllStudents {
      id
      name
      contactInfo
      class
      timeSlot
      joiningDate
      isActive
    }
  }
`;

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeSlotFilter, setTimeSlotFilter] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await client.request(GET_ALL_STUDENTS_QUERY);
      setStudents(response.getAllStudents);
      setFilteredStudents(response.getAllStudents); // Set initial filtered students
    } catch (error) {
      setError(`Error fetching students: ${error.message}`);
    } finally {
      // Wait for 1 second before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

    // Sort by time slot
    updatedStudents.sort((a, b) => (a.timeSlot > b.timeSlot ? 1 : -1));

    setFilteredStudents(updatedStudents);
  }, [statusFilter, timeSlotFilter, students]);

  if (loading) {
    return <Loader />;
  }
  // if (error) return <p className="text-red-500">{error}</p>;

  const uniqueTimeSlots = [
    ...new Set(students.map((student) => student.timeSlot)),
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">All Students</h1>

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

      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <Table.Root className="min-w-full border-collapse border border-gray-300">
          <Table.Header>
            <Table.Row className="text-yellow-400">
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Time Slot</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Visit</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredStudents.map((student, index) => (
              <Table.Row key={student.id} className="cursor-pointer">
                <Table.ColumnHeaderCell>{index + 1}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{student.name}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  {student.timeSlot}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Link href={`/student/${student.id}`}>
                    <p className="text-blue-500 underline flex items-center gap-2">
                      <Link1Icon /> Visit
                    </p>
                  </Link>
                </Table.ColumnHeaderCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
};

export default StudentsPage;
