"use client"
import { use, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNotifyAndNavigate } from "@/utils/notify_and_navigate";
import useClient from "@/utils/graphql";

const LOGIN_MUTATION = `
  mutation LoginTeacher($email: String!, $password: String!) {
    loginTeacher(email: $email, password: $password) {
      token
      teacher {
        id
        username
        email
      }
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const notifyAndNavigate = useNotifyAndNavigate();
  const client = useClient();
  const handleLogin = async () => {
    try {
      const data = await client.request(LOGIN_MUTATION, { email, password });
      localStorage.setItem("authToken", data.loginTeacher.token);
      localStorage.setItem("teacherId", data.loginTeacher.teacher.id);
      notifyAndNavigate("Login successful", "/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
      type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
