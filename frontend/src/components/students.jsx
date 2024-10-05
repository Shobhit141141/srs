"use client";
import { useEffect, useState } from "react";
import client from "@/utils/graphql"; // Adjust the path as necessary
import Link from "next/link";
import { Spinner } from "@nextui-org/react";
import { Table } from "@radix-ui/themes";
import { Link1Icon } from "@radix-ui/react-icons";

const GET_ALL_STUDENTS_QUERY = `
  query {
    getAllStudents {
      id
      name
      contactInfo
      class
      timeSlot
      joiningDate
    }
  }
`;

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await client.request(GET_ALL_STUDENTS_QUERY);
      setStudents(response.getAllStudents);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
        <Spinner />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }
  // if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">All Students</h1>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <Table.Root className="min-w-full border-collapse border border-gray-300">
          <Table.Header>
            <Table.Row className="text-yellow-400">
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              {/* <Table.ColumnHeaderCell>Contact Info</Table.ColumnHeaderCell> */}
              {/* <Table.ColumnHeaderCell >Class</Table.ColumnHeaderCell> */}
              <Table.ColumnHeaderCell>Time Slot</Table.ColumnHeaderCell>
              {/* <Table.ColumnHeaderCell>Joining Date</Table.ColumnHeaderCell> */}
              <Table.ColumnHeaderCell>Visit</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {students.map((student, index) => (
              <Table.Row className="cursor-pointer">
                <Table.ColumnHeaderCell>{index + 1}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{student.name}</Table.ColumnHeaderCell>
                {/* <Table.ColumnHeaderCell>
                  {student.contactInfo}
                </Table.ColumnHeaderCell> */}
                {/* <Table.ColumnHeaderCell>{student.class}</Table.ColumnHeaderCell> */}
                <Table.ColumnHeaderCell>
                  {student.timeSlot}
                </Table.ColumnHeaderCell>
                {/* <Table.ColumnHeaderCell>
                  {student.joiningDate}
                </Table.ColumnHeaderCell> */}
                <Table.ColumnHeaderCell>
                  <Link href={`/student/${student.id}`}>
                    <p className="text-blue-500 underline flex items-center gap-2">
                      {" "}
                      <Link1Icon />{" "}
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
