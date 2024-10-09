"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react"; // Import Spinner for loading
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import { useRouter } from "next/navigation";
import useApi from "@/apis/api";
import ProtectedRoute from "@/components/Protected";
const UpdateStudentPage = ({ params }) => {
  const { id: studentId } = params;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [message, setMessage] = useState("");
  const notifyAndNavigate = useNotifyAndNavigate();

  // State to hold the original student data
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { getStudentById, updateStudent } = useApi();
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true); // Start loading
      try {
        const response = await getStudentById(studentId); // Fetch student by ID
        console.log("response", response);
        setOriginalData(response);

        // Set form values
        for (const key in response) {
          setValue(key, response[key]);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchStudent(); // Fetch the student
  }, [studentId, setValue]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        feesAmount: parseFloat(data.feesAmount),
      };

      await updateStudent(studentId, formattedData);
      notifyAndNavigate("Student updated successfully", "/");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto p-4 mb-[100px]">
        <h1 className="text-[44px] font-bold mb-4">Update Student</h1>
        {loading ? ( // Show loading spinner while data is being fetched
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {originalData && (
              <>
                <div>
                  <label htmlFor="name" className="block">
                    Name:
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className={`border p-2 w-full ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="joiningDate" className="block">
                    Joining Date:
                  </label>
                  <input
                    type="date"
                    id="joiningDate"
                    {...register("joiningDate")}
                    className={`border p-2 w-full ${
                      errors.joiningDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block">
                    Contact Info:
                  </label>
                  <input
                    id="contactInfo"
                    {...register("contactInfo", { pattern: /^\d{10}$/ })}
                    className={`border p-2 w-full ${
                      errors.contactInfo ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.contactInfo && (
                    <p className="text-red-500">
                      Contact info must be a 10-digit mobile number
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="class" className="block">
                    Class:
                  </label>
                  <select
                    id="class"
                    {...register("class")}
                    className={`border p-2 w-full ${
                      errors.class ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Class</option>
                    {Array.from({ length: 7 }, (_, i) => (
                      <option key={i + 2} value={`${i + 2}`}>
                        {`${i + 2}th`}
                      </option>
                    ))}
                    {["9th", "10th", "11th", "12th"].map((grade) => (
                      <optgroup key={grade} label={`${grade}`}>
                        <option
                          value={`${grade} - Hindi`}
                        >{`${grade} - Hindi Medium`}</option>
                        <option
                          value={`${grade} - English`}
                        >{`${grade} - English Medium`}</option>
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="feesAmount" className="block">
                    Fees Amount:
                  </label>
                  <input
                    type="number"
                    id="feesAmount"
                    min="0"
                    {...register("feesAmount", { min: 0 })}
                    className={`border p-2 w-full ${
                      errors.feesAmount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="timeSlot" className="block">
                    Time Slot:
                  </label>
                  <select
                    id="timeSlot"
                    {...register("timeSlot")}
                    className={`border p-2 w-full ${
                      errors.timeSlot ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Time Slot</option>
                    {Array.from({ length: 14 }, (_, index) => {
                      const hour = 7 + index;
                      const ampm = hour < 12 ? "AM" : "PM";
                      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                      const timeSlot = `${displayHour} - ${
                        (displayHour % 12) + 1
                      } ${ampm}`;
                      return (
                        <option key={index} value={timeSlot}>
                          {timeSlot}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block">
                    Notes:
                  </label>
                  <textarea
                    id="notes"
                    {...register("notes")}
                    className={`border p-2 w-full ${
                      errors.notes ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:text-white"
                  >
                    Update Student
                  </Button>

                  {/* Clear Button */}
                  <Button
                    type="button"
                    color="danger"
                    onPress={() => reset()}
                    className="p-2 rounded"
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}

            {message && <p className="mt-4">{message}</p>}
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default UpdateStudentPage;
