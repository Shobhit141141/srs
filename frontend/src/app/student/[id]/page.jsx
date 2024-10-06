"use client";
import client from "@/utils/graphql";
import { useEffect, useState } from "react";
import {
  CREATE_FEES_RECORD_MUTATION,
  DELETE_STUDENT_MUTATION,
  GET_STUDENT_BY_ID_QUERY,
  TOGGLE_ACTIVE_STATUS_MUTATION,
} from "@/queries/graphqlQueires";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import { Badge, Button } from "@radix-ui/themes";
import { Edit2Icon, Phone, Trash2 } from "lucide-react";
import Loader from "@/ui/Loader";
import { Accordion, AccordionItem, Chip, Input } from "@nextui-org/react";
import Link from "next/link";
import { UpdateIcon } from "@radix-ui/react-icons";

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
        studentName: student.name,
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
        isActive: updatedStudent.toggleStudentActive.isActive,
      }));
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return <Loader />;
  }

  if (!student) {
    return <p>No student found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg mb-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Details</h1>

      <div className="mb-6 bg-[#151515] rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <strong className="text-yellow-400">ID:</strong>
            <span className="text-white">{student.id}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-yellow-400">Name:</strong>
            <span className="text-white">{student.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-yellow-400">Contact Info:</strong>
            <span className="text-blue-400 flex flex-row gap-1 items-center">
              <Phone className="scale-[0.7]"/>{" "}
              <Link href={`tel:${student.contactInfo}`}>
                {student.contactInfo}
              </Link>
            </span>
          </div>

          <div className="flex justify-between">
            <strong className="text-yellow-400">Fees:</strong>
            <Chip color="warning" variant="flat" className="text-white">
              ₹ {student.feesAmount}
            </Chip>
          </div>
          <div className="flex justify-between">
            <strong className="text-yellow-400">Class:</strong>
            <span className="text-white">{student.class}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-yellow-400">Time Slot:</strong>
            <span className="text-white">{student.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-yellow-400">Joining Date:</strong>
            <span className="text-white">
              {formatDate(student.joiningDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <strong className="text-yellow-400">Status:</strong>
            <Badge
              color={student.isActive ? "green" : "red"}
              onClick={toggleActiveStatus}
              className="cursor-pointer px-2 py-1"
              variant="solid"
            >
              {student.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* <h2 className="text-lg font-semibold mb-4">Fees Records</h2> */}
      {feesRecords.length === 0 ? (
        <div className="border rounded-lg shadow-sm p-4 mb-4 bg-red-500 font-bold text-center">
          No fees records found for this student.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {feesRecords.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg shadow-sm p-4 bg-[#151515]"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {formatDate(record.date_of_payment)}
                </h3>
                <p>
                  <Badge
                    color="green"
                    variant=""
                    className="px-2 py-2 text-[17px]"
                  >
                    ₹{record.amount}
                  </Badge>
                </p>
              </div>
              <p className="text-[14px]">{record.status}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">Add Fees Record</h2>
      <form
        onSubmit={handleFeesRecordSubmit}
        className="flex flex-col md:flex-row mb-4 gap-4 md:items-center items-start justify-center"
      >
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          className="p-2 rounded"
          min="0"
        />
        <Input
          type="date"
          value={date_of_payment}
          onChange={(e) => setDateOfPayment(e.target.value)}
          required
          className="p-2 rounded"
        />
        <Input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Remarks"
          required
          className="p-2 rounded"
        />
        <Button color="success" type="submit" className="self-strt ml-3">
          Add Fees Record
        </Button>
      </form>

      <div className="bg-[#2a2a2a] p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2 text-yellow-500">Notes</h2>
        <p className="text-white ">{student.notes || "No notes available."}</p>
      </div>

      <div className="flex justify-start gap-2 items-center my-8">
        <Button
          color="red"
          onClick={handleDeleteStudent}
          variant="surface"
          className="px-4 py-2 flex items-center ml-1"
        >
          <Trash2 className=" scale-[0.9]" /> Delete Student
        </Button>

        <Link href={`/update-student/${student.id}`}>
          <Button
            color="blue"
            variant="surface"
            className="px-4 py-2 flex items-center ml-1"
          >
            <Edit2Icon className="scale-[0.7]" /> Update
          </Button>
        </Link>

        {/* <div className="flex items-center mr-1">
          <h2 className="text-lg font-semibold mr-2">Status:</h2>
          <Badge
            color={student.isActive ? "green" : "red"}
            onClick={toggleActiveStatus}
            className="cursor-pointer px-2 py-1"
            variant="solid"
          >
            {student.isActive ? "Active" : "Inactive"}
          </Badge>
        </div> */}
      </div>

      <div className="">
        <h2 className="text-lg font-semibold mb-2 text-yellow-500">Logs</h2>
        <div type="multiple" className="border rounded-md bg-[#151515]">
          {student.logs.length === 0 ? (
            <div className="p-4 text-white text-center">No logs available.</div>
          ) : (
            student.logs.map((log, index) => (
              <div key={index} value={`item-${index}`}>
                <div
                  className={`p-2 font-mono ${
                    log.includes("Made active")
                      ? "text-green-500"
                      : log.includes("Made inactive")
                      ? "text-red-500"
                      : "text-gray-300"
                  }`}
                >
                  - {log}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
