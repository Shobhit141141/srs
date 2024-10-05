"use client";
import { useState } from 'react';
import { request } from 'graphql-request';
import { GET_MONTHLY_FEES_REPORT } from '@/queries/graphqlQueires';

const endpoint = 'http://localhost:4000/graphql'; // Your GraphQL server endpoint

const FeesReportPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // New state for filter

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await request(endpoint, GET_MONTHLY_FEES_REPORT, { year, month });
      setReportData(data.getMonthlyFeesReport);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on the selected filter
  const getFilteredStudents = () => {
    if (!reportData) return [];
    switch (filter) {
      case 'paid':
        return reportData.paidStudents;
      case 'unpaid':
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
            className="border px-4 py-2 rounded"
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
            className="border px-4 py-2 rounded"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={fetchReport}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Loading...' : 'Get Report'}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'border'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded ${filter === 'paid' ? 'bg-green-600 text-white' : 'border'}`}
        >
          Paid
        </button>
        <button
          onClick={() => setFilter('unpaid')}
          className={`px-4 py-2 rounded ${filter === 'unpaid' ? 'bg-red-600 text-white' : 'border'}`}
        >
          Unpaid
        </button>
      </div>

      {/* Display the Results */}
      {reportData && (
        <div>
          <h2 className="text-lg font-semibold">Summary for {months[month - 1].label}, {year}</h2>
          <p>Paid Students: {reportData.paidFeesCount}</p>
          <p>Unpaid Students: {reportData.unpaidFeesCount}</p>

          {/* Display the filtered students */}
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Date of Payment</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredStudents().map((student) => (
                <tr key={student.studentId || student.id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{student.studentName || student.name}</td>
                  <td className="border border-gray-300 px-4 py-2">₹{student.amount || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.date_of_payment ? new Date(student.date_of_payment).toLocaleDateString() : '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.amount ? 'Paid' : 'Unpaid'}</td>
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
