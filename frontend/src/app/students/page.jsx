"use client";
import { useEffect, useState } from "react";
import client from "@/utils/graphql"; // Adjust the path as necessary
import Link from "next/link";

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
      const response = await client.request(GET_ALL_STUDENTS_QUERY);
      setStudents(response.getAllStudents);
    } catch (error) {
      setError(`Error fetching students: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">All Students</h1>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-yellow-400">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Contact Info</th>
              <th className="border border-gray-300 p-2">Class</th>
              <th className="border border-gray-300 p-2">Time Slot</th>
              <th className="border border-gray-300 p-2">Joining Date</th>
              <th className="border border-gray-300 p-2">Visit</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
             
                <tr className="text-center cursor-pointer">
                  <td className="border border-gray-300 p-2">{student.id}</td>
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  <td className="border border-gray-300 p-2">
                    {student.contactInfo}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {student.class}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {student.timeSlot}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {student.joiningDate}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Link href={`/student/${student.id}`}>
                      <p className="text-blue-600 underline">Visit</p>
                    </Link>
                  </td>
                </tr>
     
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentsPage;
