"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import useApi from "@/apis/api";
import { useRouter } from "next/navigation";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { signupTeacher, loginTeacher, getTeacherById } = useApi();
  const notify_and_navigate = useNotifyAndNavigate();

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    if (teacherId) {
      const res = getTeacher(teacherId);
      if (res) {
        setLoading(true);
      } else {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const getTeacher = async (id) => {
    try {
      setLoading(true);
      const response = await getTeacherById(id);
      setTeacher(response);
      toast.success("Welcome Back 🎉")
    } catch (error) {
      console.error("Error fetching teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginTeacher(email, password);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("teacherId", data.teacher.id);
      setTeacher(data.teacher);
      notify_and_navigate("Login successful", "/");
      router.push("/"); // Redirect to homepage or intended page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signup = async (username, email, password) => {
    const data = await signupTeacher(username, email, password);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("teacherId", data.teacher.id);
    setTeacher(data.teacher);
    notify_and_navigate("Signup successful", "/");
    router.push("/"); // Redirect to homepage or intended page
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("teacherId");
    setTeacher(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ teacher, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
