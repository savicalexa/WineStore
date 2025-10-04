import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ") || "-";

    await api.post("/api/users", {
      firstName,
      lastName,
      email,
      password,
      role: "Customer"
    });

    nav("/login");
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Create account</h2>
      <input placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
}
