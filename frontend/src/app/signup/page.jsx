"use client";
import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import useClient from "@/utils/graphql";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";

const SIGNUP_MUTATION = `
  mutation SignupTeacher($username: String!, $email: String!, $password: String!) {
    signupTeacher(username: $username, email: $email, password: $password) {
      token
      teacher {
        id
        username
        email
      }
    }
  }
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const notifyAndNavigate = useNotifyAndNavigate();
  const client = useClient();
  console.log(client);
  const handleSignup = async () => {
    try {
      const data = await client.request(SIGNUP_MUTATION, {
        username,
        email,
        password,
      });

      localStorage.setItem("authToken", data.signupTeacher.token);
      localStorage.setItem("teacherId", data.signupTeacher.teacher.id);
      notifyAndNavigate("Signup successful", "/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-md">
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
