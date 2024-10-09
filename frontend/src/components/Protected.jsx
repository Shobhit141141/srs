"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "@/ui/Loader";

const ProtectedRoute = ({ children }) => {
  const { teacher, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect to login if loading is complete and teacher is not authenticated
    if (!loading && !teacher) {
      localStorage.setItem("intendedRoute", window.location.pathname);
      router.push("/login");
    }
  }, [teacher, loading, router]);

  // While checking auth, you can return a loading spinner
  if (loading) return <Loader/>;

  return children;
};

export default ProtectedRoute;
