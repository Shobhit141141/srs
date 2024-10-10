import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://srs-toqc.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// Create a separate function to manage API calls
const useApi = () => {
  
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  
  // Create Fees Record ✅
  const createFeesRecord = async (data) => {
    try {
      const response = await api.post("/fees", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create fees record: ${error.message}`);
    }
  };
  // Update Student ✅
  const updateStudent = async (id, data) => {
    try {
      const response = await api.put(`/students/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
  };
  // Get teacher by ID ✅
  const getTeacherById = async (id) => {
    try {
      const response = await api.get(`/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get teacher: ${error.message}`);
    }
  };
  // Login teacher ✅
  const loginTeacher = async (email, password) => {
    try {
      const response = await api.post("/teachers/login", { email, password });
  
      // If login is successful
      if (response.status === 200) {
        toast.success("Login successful!");
        return response.data;  // Use the returned data as needed
      }
    } catch (error) {
      // Handle errors during the API call
      if (error.response) {
        // Handle known error status codes (like 401 for invalid credentials)
        if (error.response.status === 401) {
          toast.error(error.response.data?.message || "Invalid email or password");
        } else {
          toast.error(`Error: ${error.response.data?.message || "Something went wrong!"}`);
        }
      } else {
        // Handle network or unknown errors
        toast.error("An error occurred while logging in. Please try again later.");
      }
  
      console.error("Error logging in teacher:", error);
    }
  };
  // Get student by ID ✅
  const getStudentById = async (id) => {
    try {
      const response = await api.get(`/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get student: ${error.message}`);
    }
  };
  // Get all students ✅
  const getAllStudents = async () => {
    try {
      const response = await api.get("/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get all students: ${error.message}`);
    }
  };
  // Create student ✅
  const createStudent = async (data) => {
    try {
      const response = await api.post("/students", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create student: ${error.message}`);
    }
  };
  // Signup teacher ✅
  const signupTeacher = async (username, email, password) => {
    try {
      const response = await api.post("/teachers/signup", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to sign up teacher: ${error.message}`);
    }
  };
  // Get student logs ✅
  const getStudentLogs = async (id) => {
    try {
      const response = await api.get(`/students/${id}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get student logs: ${error.message}`);
    }
  };
  // Delete student ✅
  const deleteStudent = async (id) => {
    try {
      const response = await api.delete(`/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  };
  // Toggle student active status ✅
  const toggleStudentActive = async (id) => {
    try {
      const response = await api.post(
        `/students/${id}/toggle-active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to toggle student active status: ${error.message}`
      );
    }
  };
  // Get monthly fees report ✅
  const getMonthlyFeesReport = async (year, month) => {
    try {
      const response = await api.post(
        "/fees/monthly",
        { year, month }, // Ensure the correct structure
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get monthly fees report: ${error.message}`);
    }
  };

  return {
    createFeesRecord,
    updateStudent,
    getTeacherById,
    loginTeacher,
    getStudentById,
    getAllStudents,
    createStudent,
    signupTeacher,
    getStudentLogs,
    deleteStudent,
    toggleStudentActive,
    getMonthlyFeesReport,
  };
};

// Export the hook to use in components
export default useApi;
