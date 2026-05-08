"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { lang } = useLanguage();
  const tr = t[lang];

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(tr.emailRequired);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(tr.emailInvalid);
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError(tr.passwordRequired);
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    validateEmail(email);
    validatePassword(password);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) return;

    try {
      const res = await api.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", String(res.data.userId));
      localStorage.setItem("firstName", res.data.firstName);
      localStorage.setItem("lastName", res.data.lastName);
      localStorage.setItem("role", res.data.role);
      document.cookie = `role=${res.data.role}; path=/`;
      if (res.data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(tr.loginError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-96 border border-stone-200">
        <h1 className="text-2xl font-light text-center text-stone-800 tracking-[0.3em] mb-1">ALEXSHOP</h1>
        <div className="w-8 h-px bg-stone-300 mx-auto mb-8"></div>
        <h2 className="text-xs text-center text-stone-400 tracking-widest mb-8">{tr.memberLogin}</h2>
        {error && <p className="text-rose-400 text-xs text-center bg-rose-50 p-2 rounded-lg mb-4">{error}</p>}
        <form noValidate onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder={tr.email}
              value={email}
              onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
              className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
            />
            {emailError && <p className="text-rose-400 text-xs px-1">{emailError}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder={tr.password}
              value={password}
              onChange={(e) => { setPasssword(e.target.value); validatePassword(e.target.value); }}
              className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition"
            />
            {passwordError && <p className="text-rose-400 text-xs px-1">{passwordError}</p>}
          </div>
          <button type="submit" className="mt-4 bg-stone-800 hover:bg-stone-900 text-white p-3 rounded-full text-sm tracking-widest transition">
            {tr.loginBtn}
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-6">
          {tr.noAccount}
          <a href="/register" className="text-stone-600 hover:text-stone-800 transition ml-1">{tr.register}</a>
        </p>
      </div>
    </div>
  );
}
