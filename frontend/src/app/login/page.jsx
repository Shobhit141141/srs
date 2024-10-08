"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/ui/Loader";
import { Input } from "@nextui-org/react";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, teacher } = useAuth();
  const router = useRouter();

  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    let valid = true;
    setErrors({ email: "", password: "" });

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      valid = false;
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      valid = false;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      valid = false;
    } else if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters long" }));
      valid = false;
    }

    if (valid) {
      try {
        await login(email, password);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    if (!loading && teacher) {
      router.push("/");
    }
  }, [loading, teacher, router]);

  if (loading || teacher) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className=" p-8 rounded-lg shadow-lg w-96 border-2 border-white">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-xl border ${
              errors.email ? "border-red-500" : "border-gray-600"
            } `}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-xl  border ${
              errors.password ? "border-red-500" : "border-gray-600"
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>

        <div className="mt-6 flex gap-2 justify-start items-center">
          <p>Don't have an account?</p>
          <Link href="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
          </div>
      </div>
    </div>
  );
};

export default Login;
