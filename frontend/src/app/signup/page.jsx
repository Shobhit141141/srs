"use client";
import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import useClient from "@/utils/graphql";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/ui/Loader";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const client = useClient();
  const { teacher, loading, signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await signup(username, email, password);
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
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <Input
          className="mb-4"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          bordered
        />
        <Input
          className="mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bordered
        />
        <Input
          className="mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bordered
        />
        <Button className="w-full" onClick={handleSignup}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Signup;
