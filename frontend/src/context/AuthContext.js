"use client";
import React, { createContext,  useContext, useEffect, useState } from "react";
import { GraphQLClient } from "graphql-request";
import useClient from "@/utils/graphql";
import { GET_TEACHER_BY_ID } from "@/queries/graphqlQueires";
import { set } from "react-hook-form";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useClient();

  const id = localStorage.getItem("teacherId");
  const getTeacher = async () => {
    try {
      const response = await client.request(GET_TEACHER_BY_ID, { id });
      console.log(response.getTeacherById);
      setTeacher(response.getTeacherById);
    } catch (error) {
      console.error("Error fetching teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client) getTeacher();
  }, [client,id ]);

  const logout = () => {
    localStorage.removeItem("authToken");
    setTeacher(null);
  };

  return (
    <AuthContext.Provider value={{ teacher, getTeacher, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
