"use client";
import { useState } from "react";
import { request } from "graphql-request";
import { GET_MONTHLY_FEES_REPORT } from "@/queries/graphqlQueires";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Badge, Button } from "@radix-ui/themes";
import { Chip } from "@nextui-org/react";
import Link from "next/link";

const endpoint = "http://localhost:4000/graphql"; // Your GraphQL server endpoint

const FeesReportPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // New state for filter

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await request(endpoint, GET_MONTHLY_FEES_REPORT, {
        year,
        month,
      });
      setReportData(data.getMonthlyFeesReport);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on the selected filter
  const getFilteredStudents = () => {
    if (!reportData) return [];
    switch (filter) {
      case "paid":
        return reportData.paidStudents;
      case "unpaid":
        return reportData.unpaidStudents;
      default:
        return [...reportData.paidStudents, ...reportData.unpaidStudents];
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Monthly Fees Report</h1>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-6">
        {/* Year Selector */}
        <div>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border border-SelectItem-300 px-4 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            {Array.from({ length: 5 }, (_, index) => {
              const value = new Date().getFullYear() - index;
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border border-SelectItem-300 px-4 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          onClick={fetchReport}
          className="px-4 py-1 bg-blue-600 w-[120px] text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Get Report"}
        </Button>
      </div>

      {/* Radix Tabs for Filters */}
      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={setFilter}
        className="mb-4"
      >
        <TabsList className="flex space-x-4">
          <TabsTrigger
            value="all"
            className={`px-4 py-1 rounded ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "border border-SelectItem-300"
            }`}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="paid"
            className={`px-4 py-1 rounded ${
              filter === "paid"
                ? "bg-green-600 text-white"
                : "border border-SelectItem-300"
            }`}
          >
            Paid
          </TabsTrigger>
          <TabsTrigger
            value="unpaid"
            className={`px-4 py-1 rounded ${
              filter === "unpaid"
                ? "bg-red-600 text-white"
                : "border border-SelectItem-300"
            }`}
          >
            Unpaid
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Display the Results */}
      {reportData && (
        <div>
          {/* Summary Section */}
          <div className=" p-6 rounded-lg  mb-6 border shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-400">
              Summary for {months[month - 1].label}, {year}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Paid Students Card */}
              <div className="bg-green-200 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-green-800">
                  Paid Students
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {reportData.paidFeesCount}
                </p>
              </div>

              {/* Unpaid Students Card */}
              <div className="bg-red-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-red-800">
                  Unpaid Students
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {reportData.unpaidFeesCount}
                </p>
              </div>
            </div>
          </div>

          {/* Display the filtered students */}
          <table className="min-w-full border-collapse border border-SelectItem-300 mt-4">
            <thead>
              <tr className="bg-SelectItem-100">
                <th className="border border-SelectItem-300 px-4 py-2">Name</th>
                <th className="border border-SelectItem-300 px-4 py-2">
                  Amount
                </th>
                <th className="border border-SelectItem-300 px-4 py-2">
                  Date of Payment
                </th>
                <th className="border border-SelectItem-300 px-4 py-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredStudents().map((student) => (
                <tr
                  key={student.studentId || student.id}
                  className="border border-SelectItem-300 even:bg-SelectItem-50"
                >
                  <td className="border border-SelectItem-300 px-4 py-2 hover:text-blue-500 hover:underline transition-all">
                  <Link href={`/student/${student.studentId || student.id}`}>
                    {student.studentName || student.name}
                  </Link>
                  </td>
                  <td className="border border-SelectItem-300 px-4 py-2">
                    ₹{student.amount ? student.amount : " - "}
                  </td>
                  <td className="border border-SelectItem-300 px-4 py-2">
                    {student.date_of_payment
                      ? new Date(student.date_of_payment).toLocaleDateString()
                      : " -/--/---- "}
                  </td>
                  <td className={`border border-SelectItem-300 px-4 py-2`}>
                    <Chip
                      className="mx-auto"
                      variant="flat"
                      color={`${student.amount ? "success" : "danger"}`}
                    >
                      {student.amount ? "Paid" : "Unpaid"}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeesReportPage;
