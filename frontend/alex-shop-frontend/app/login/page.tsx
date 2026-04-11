// login page:
// 1) email and password
// 2) submit button
// 3) on submit, call API to authenticate user
// 4) if successful, redirect to home page
// 5) if failed, show error message

"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", String(res.data.userId));
      localStorage.setItem("firstName", res.data.firstName);
      localStorage.setItem("lastName", res.data.lastName);
      localStorage.setItem("role", res.data.role);
      document.cookie = `role=${res.data.role}; path=/`;

      if (res.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-96 border border-stone-200">
        <h1 className="text-2xl font-light text-center text-stone-800 tracking-[0.3em] mb-1">
          ALEXSHOP
        </h1>
        <div className="w-8 h-px bg-stone-300 mx-auto mb-8"></div>
        <h2 className="text-xs text-center text-stone-400 tracking-widest mb-8">
          メンバーログイン
        </h2>
        {error && (
          <p className="text-rose-400 text-xs text-center bg-rose-50 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none
  focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPasssword(e.target.value)}
            className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none
  focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
          />
          <button
            type="submit"
            className="mt-4 bg-stone-800 hover:bg-stone-900 text-white p-3 rounded-full text-sm tracking-widest
  transition"
          >
            ログイン
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-6">
          アカウントをお持ちでないですか？
          <a
            href="/register"
            className="text-stone-600 hover:text-stone-800 transition"
          >
            登録
          </a>
        </p>
      </div>
    </div>
  );
}
