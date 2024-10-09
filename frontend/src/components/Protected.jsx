"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "@/ui/Loader";

const ProtectedRoute = ({ children }) => {
  const { teacher, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated and loading is complete
    if (!loading && !teacher) {
      router.push("/login");
    }
  }, [teacher, loading, router]);

  // While checking auth, return a loading spinner
  if (loading) return <Loader />;

  return children;
};

export default ProtectedRoute;
