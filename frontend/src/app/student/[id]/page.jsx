"use client";
import client from "@/utils/graphql";
import { useEffect, useState } from "react";
import { Switch, toggle } from "@nextui-org/react";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  CREATE_FEES_RECORD_MUTATION,
  DELETE_STUDENT_MUTATION,
  GET_STUDENT_BY_ID_QUERY,
  TOGGLE_ACTIVE_STATUS_MUTATION,
} from "@/queries/graphqlQueires";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import { Badge } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";
import { Delete, DeleteIcon, LucideDelete, Trash2 } from "lucide-react";
const StudentDetailsPage = ({ params }) => {
  const { id } = params;

  const [student, setStudent] = useState(null);
  const [amount, setAmount] = useState("");
  const [date_of_payment, setDateOfPayment] = useState("");
  const [status, setStatus] = useState("");
  const [feesRecords, setFeesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const notifyAndNavigate = useNotifyAndNavigate();
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
        date_of_payment,
        status,
      });
      setFeesRecords([...feesRecords, newRecord.createFeesRecord]);
      setAmount("");
      setDateOfPayment("");
      setStatus("");
    } catch (error) {
      console.error("Error creating fees record:", error);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await client.request(DELETE_STUDENT_MUTATION, { id });
      notifyAndNavigate("Student deleted successfully!", "/");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const toggleActiveStatus = async () => {
    try {
      const updatedStudent = await client.request(
        TOGGLE_ACTIVE_STATUS_MUTATION,
        {
          id,
        }
      );
      setStudent((prev) => ({
        ...prev,
        isActive: updatedStudent.toggleStudentActive.isActive, // Update state with the new isActive status
      }));
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; 
    const year = date.getFullYear(); // Get full year
  
    return `${day}-${month}-${year}`; // Format as DD MM YYYY
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!student) {
    return <p>No student found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 ">
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

      <Button
        color="red"
        onClick={handleDeleteStudent}
        variant="surface"
        className="px-2 py-0"
      >
        <Trash2 className="scale-[0.9]" /> Delete Student
      </Button>

      <h2 className="text-lg font-semibold mb-2">Toggle Active Status</h2>

      <Badge
        color={`${student.isActive ? "green" : "red"}`}
        onClick={toggleActiveStatus}
        className="cursor-pointer px-2 py-1"
        variant="solid"
      >
        {student.isActive ? "Active" : "Inactive"}
      </Badge>

      <h2 className="text-lg font-semibold mb-2">Fees Records</h2>
      {feesRecords.length === 0 ? (
        <p>No fees records found for this student.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {feesRecords.map((record) => (
            <div key={record.id} className="border rounded p-4">
             <h3 className="font-semibold">{formatDate(record.date_of_payment)}</h3>
              <p>
                <strong>Amount:</strong> {record.amount}
              </p>
              <p>
                <strong>Status:</strong> {record.status}
              </p>
            </div>
          ))}
        </div>
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
        {/* <input
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
        /> */}
        <input
          type="date"
          value={date_of_payment}
          onChange={(e) => setDateOfPayment(e.target.value)}
          placeholder="Date of Payment"
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
        <Button color="success" type="submit">
          Add Fees Record
        </Button>
      </form>
    </div>
  );
};

export default StudentDetailsPage;
