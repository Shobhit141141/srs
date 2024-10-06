"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import client from "@/utils/graphql";
import { Button } from "@nextui-org/react";
import { CREATE_STUDENT_MUTATION } from "@/queries/graphqlQueires";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import { useRouter } from "next/navigation";

const CreateStudentPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [message, setMessage] = useState("");
  const notifyAndNavigate = useNotifyAndNavigate();

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        feesAmount: parseFloat(data.feesAmount),
      };

      const response = await client.request(CREATE_STUDENT_MUTATION, {
        input: formattedData,
      });
      notifyAndNavigate("Student created successfully", "/");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mb-[100px]">
      <h1 className="text-[44px] font-light mb-4">Create Student</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block">
            Name:
          </label>
          <input
            id="name"
            {...register("name", { required: true })}
            className={`border p-2 w-full ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500">Name is required</p>}
        </div>

        <div>
          <label htmlFor="joiningDate" className="block">
            Joining Date:
          </label>
          <input
            type="date"
            id="joiningDate"
            {...register("joiningDate", { required: true })}
            className={`border p-2 w-full ${
              errors.joiningDate ? "border-red-500" : "border-gray-300"
            }`}
            onClick={(e) => e.target.showPicker()} // Show the date picker on input click
          />
          {errors.joiningDate && (
            <p className="text-red-500">Joining Date is required</p>
          )}
        </div>

        <div>
          <label htmlFor="contactInfo" className="block">
            Contact Info:
          </label>
          <input
            id="contactInfo"
            {...register("contactInfo", {
              required: true,
              pattern: /^\d{10}$/,
            })}
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
            {...register("class", { required: true })}
            className={`border p-2 w-full ${
              errors.class ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Class</option>
            {/* Classes 2nd to 8th */}
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i + 2} value={`${i + 2}`}>
                {`${i + 2}th`}
              </option>
            ))}

            {/* Classes 9th to 12th with Hindi and English medium */}
            {["9th", "10th", "11th", "12th"].map((grade) => (
              <optgroup key={grade} label={`${grade}`}>
                <option
                  value={`${grade} - Hindi`}
                >{`${grade} - Hindi Medium`}</option>
                <option value={`${grade} - English`}>
                  {`${grade} - English Medium`}
                </option>
              </optgroup>
            ))}
          </select>
          {errors.class && <p className="text-red-500">Class is required</p>}
        </div>

        <div>
          <label htmlFor="feesAmount" className="block">
            Fees Amount:
          </label>
          <input
            type="number"
            id="feesAmount"
            min="0"
            {...register("feesAmount", { required: true, min: 0 })} // Include min validation here
            className={`border p-2 w-full ${
              errors.feesAmount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.feesAmount && (
            <p className="text-red-500">
              Fees Amount is required and must be a non-negative number
            </p>
          )}
    
        </div>
        <div>
          <label htmlFor="timeSlot" className="block">
            Time Slot:
          </label>
          <select
            id="timeSlot"
            {...register("timeSlot", { required: true })}
            className={`border p-2 w-full ${
              errors.timeSlot ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Time Slot</option>
            {/* Time slots from 7 AM to 9 PM in 12-hour format */}
            {Array.from({ length: 14 }, (_, index) => {
              const hour = 7 + index;
              const ampm = hour < 12 ? "AM" : "PM";
              const displayHour = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
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
          {errors.timeSlot && (
            <p className="text-red-500">Time Slot is required</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block">
            Notes:
          </label>
          <textarea
  id="notes"
  {...register("notes", { required: true })} // Add required validation
  className={`border p-2 w-full ${
    errors.notes ? "border-red-500" : "border-gray-300"
  }`}
/>
{errors.notes && <p className="text-red-500">Notes are required</p>} 
        </div>

        <div className="flex justify-between">
          <Button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:text-white"
          >
            Create Student
          </Button>

          {/* Clear Button */}
          <Button
            type="button"
            color="danger"
            onPress={() => reset()} // Resets form fields
            className=" p-2 rounded"
          >
            Clear
          </Button>
        </div>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default CreateStudentPage;
