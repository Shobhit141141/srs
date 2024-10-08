"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "@/ui/Loader";

const AuthenticatedRoute = ({ children }) => {
  const { teacher, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (teacher) {
        // If user is authenticated, redirect to home
        router.push("/");
      }
      // If not authenticated, allow access to the page
    }
  }, [teacher, loading, router]);

  // If still loading, show a loader
  if (loading) return <Loader />;

  return children;
};

export default AuthenticatedRoute;
