"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { GraphQLClient } from "graphql-request";
import useClient from "@/utils/graphql";
import { GET_TEACHER_BY_ID, LOGIN_MUTATION, SIGNUP_MUTATION } from "@/queries/graphqlQueires";
import { useRouter } from "next/navigation";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useClient(); // Get the client directly from the hook
  const router = useRouter();
  const notify_and_navigate = useNotifyAndNavigate();

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    if (teacherId) {
      getTeacher(teacherId); // Fetch teacher data if ID is available
    } else {
      setLoading(false); // Set loading to false if no teacherId
      router.push("/login");
    }
  }, [client]);

  const getTeacher = async (id) => {
    try {
      setLoading(true);
      if (!client) return;
      const response = await client.request(GET_TEACHER_BY_ID, { id });
      notify_and_navigate("Welcome back!", "/");
      setTeacher(response.getTeacherById);
    } catch (error) {
      console.error("Error fetching teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await client.request(LOGIN_MUTATION, { email, password });
      localStorage.setItem("authToken", data.loginTeacher.token);
      localStorage.setItem("teacherId", data.loginTeacher.teacher.id);

      await getTeacher(data.loginTeacher.teacher.id);
      notify_and_navigate("Login successful", "/");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signup = async (username, email, password) => {
    const data = await client.request(SIGNUP_MUTATION, {
      username,
      email,
      password,
    });

    localStorage.setItem("authToken", data.signupTeacher.token);
    localStorage.setItem("teacherId", data.signupTeacher.teacher.id);
    notify_and_navigate("Signup successful", "/");
    await getTeacher(data.signupTeacher.teacher.id);
    router.push("/");
  }


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
