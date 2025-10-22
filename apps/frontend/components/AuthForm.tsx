"use client";
import { useState } from "react";
import api from "../lib/api";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const endpoint = type === "login" ? "/auth/login" : "/auth/register";
    const res = await api.post(endpoint, { email, password });
    if (type === "login") {
      localStorage.setItem("token", res.data.token);
      alert("✅ Logged in!");
      window.location.href = "/"; // or diagram page
    } else {
      alert("✅ Registered! Please log in.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded text-white">
      <h2 className="text-xl mb-4 capitalize">{type}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 rounded text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 rounded text-black"
      />
      <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
        {type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
