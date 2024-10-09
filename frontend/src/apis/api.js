"use client";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Create a separate function to manage API calls
const useApi = () => {
  const token = localStorage.getItem("authToken");

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
      return response.data;
    } catch (error) {
      throw new Error(`Failed to log in teacher: ${error.message}`);
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
        '/fees/monthly', 
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
