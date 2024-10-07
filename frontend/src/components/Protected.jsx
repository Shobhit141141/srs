"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "@/ui/Loader";

const ProtectedRoute = ({ children }) => {
  const { teacher,loading } = useAuth();
  const router = useRouter();
  console.log("teacher", teacher);
  useEffect(() => {
    if (!loading && !teacher) {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [teacher, router]);

  // While checking auth, you can return null or a loading spinner
  if (!teacher) return <Loader/>;

  return children;
};

export default ProtectedRoute;
