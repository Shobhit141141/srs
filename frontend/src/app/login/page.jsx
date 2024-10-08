"use client";
import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import {  useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/ui/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, teacher } = useAuth();
  const router = useRouter();
  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!loading && teacher) {
      router.push("/");
    }
  }, [loading, teacher, router]);
  if (loading || teacher) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen  text-white">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <Button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white font-semibold"
      >
        Login
      </Button>
    </div>
  </div>
  );
};

export default Login;
