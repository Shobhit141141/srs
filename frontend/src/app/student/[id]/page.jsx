"use client";
import { gql } from "graphql-request";
import client from "@/utils/graphql"; // Adjust the path as necessary
import { useEffect, useState } from "react";

const GET_STUDENT_BY_ID_QUERY = gql`
  query GetStudentById($id: ID!) {
    getStudentById(id: $id) {
      id
      name
      contactInfo
      class
      timeSlot
      joiningDate
      feesRecords {
        id
        amount
        month
        year
        status
      }
    }
  }
`;

const CREATE_FEES_RECORD_MUTATION = gql`
  mutation CreateFeesRecord(
    $studentId: ID!
    $amount: Float!
    $month: String!
    $year: Int!
    $status: String!
  ) {
    createFeesRecord(
      studentId: $studentId
      amount: $amount
      month: $month
      year: $year
      status: $status
    ) {
      id
      amount
      month
      year
      status
    }
  }
`;

const StudentDetailsPage = ({ params }) => {
  const { id } = params;

  const [student, setStudent] = useState(null);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [feesRecords, setFeesRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student details on mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await client.request(GET_STUDENT_BY_ID_QUERY, { id });
        setStudent(response.getStudentById);
        setFeesRecords(response.getStudentById.feesRecords || []);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleFeesRecordSubmit = async (e) => {
    e.preventDefault();

    try {
      const newRecord = await client.request(CREATE_FEES_RECORD_MUTATION, {
        studentId: id,
        amount: parseFloat(amount),
        month,
        year: parseInt(year),
        status,
      });

      // Update the fees records state
      setFeesRecords([...feesRecords, newRecord.createFeesRecord]);

      // Reset form fields
      setAmount("");
      setMonth("");
      setYear("");
      setStatus("");
    } catch (error) {
      console.error("Error creating fees record:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!student) {
    return <p>No student found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Student Details</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p>
          <strong>ID:</strong> {student.id}
        </p>
        <p>
          <strong>Name:</strong> {student.name}
        </p>
        <p>
          <strong>Contact Info:</strong> {student.contactInfo}
        </p>
        <p>
          <strong>Class:</strong> {student.class}
        </p>
        <p>
          <strong>Time Slot:</strong> {student.timeSlot}
        </p>
        <p>
          <strong>Joining Date:</strong> {student.joiningDate}
        </p>
      </div>
      <h2 className="text-lg font-semibold mb-2">Fees Records</h2>
      {feesRecords.length === 0 ? (
        <p>No fees records found for this student.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Month</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {feesRecords.map((record, index) => (
              <tr key={record.id}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{record.amount}</td>
                <td className="border border-gray-300 p-2">
                  {record.month} - {record.year}
                </td>
                <td className="border border-gray-300 p-2">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2 className="text-lg font-semibold mb-2">Add Fees Record</h2>
      <form onSubmit={handleFeesRecordSubmit} className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          className="border border-gray-300 p-2 mb-2 mr-2"
        />
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Month"
          required
          className="border border-gray-300 p-2 mb-2 mr-2"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          required
          className="border border-gray-300 p-2 mb-2 mr-2"
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
          required
          className="border border-gray-300 p-2 mb-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Fees Record
        </button>
      </form>
    </div>
  );
};

export default StudentDetailsPage;
