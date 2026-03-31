// register page
// 1) username, email, password, confirm password
// 2) submit button
// 3) redirect to login page after successful registration

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    if (password !== confirmedPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/users/register", {
        username,
        email,
        password,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration Failed");
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
          アカウント作成
        </h2>
        {error && (
          <p className="text-rose-400 text-xs text-center bg-rose-50 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none
  focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
          />
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
            onChange={(e) => setPassword(e.target.value)}
            className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none
  focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none
  focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
          />
          <button
            type="submit"
            className="mt-4 bg-stone-800 hover:bg-stone-900 text-white p-3 rounded-full text-sm tracking-widest
  transition"
          >
            登録する
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-6">
          すでにアカウントをお持ちですか？
          <a
            href="/login"
            className="text-stone-600 hover:text-stone-800 transition"
          >
            ログイン
          </a>
        </p>
      </div>
    </div>
  );
}
