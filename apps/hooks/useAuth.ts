"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // load token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    await refreshUser();
  };

  const register = async (email: string, password: string) => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
      email,
      password,
    });
    await login(email, password);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
