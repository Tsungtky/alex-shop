"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");
  const { lang } = useLanguage();
  const tr = t[lang];

  const validateFirstName = (value: string) => {
    if (!value) { setFirstNameError(tr.firstNameRequired); } else { setFirstNameError(""); }
  };

  const validateLastName = (value: string) => {
    if (!value) { setLastNameError(tr.lastNameRequired); } else { setLastNameError(""); }
  };

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
    } else if (value.length < 8) {
      setPasswordError(tr.passwordTooShortMsg);
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmedPassword = (value: string) => {
    if (value !== password) { setConfirmedPasswordError(tr.passwordMismatchMsg); } else { setConfirmedPasswordError(""); }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    validateFirstName(firstName);
    validateLastName(lastName);
    validateEmail(email);
    validatePassword(password);
    validateConfirmedPassword(confirmedPassword);

    if (!firstName || !lastName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 8 || password !== confirmedPassword) return;

    try {
      await api.post("/api/users/register", { firstName, lastName, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration Failed");
    }
  };

  const inputClass = "border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-96 border border-stone-200">
        <h1 className="text-2xl font-light text-center text-stone-800 tracking-[0.3em] mb-1">ALEXSHOP</h1>
        <div className="w-8 h-px bg-stone-300 mx-auto mb-8"></div>
        <h2 className="text-xs text-center text-stone-400 tracking-widest mb-8">{tr.createAccount}</h2>
        {error && <p className="text-rose-400 text-xs text-center bg-rose-50 p-2 rounded-lg mb-4">{error}</p>}
        <form noValidate onSubmit={handleRegister} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <input type="text" placeholder={tr.firstName} value={firstName}
              onChange={(e) => { setFirstName(e.target.value); validateFirstName(e.target.value); }} className={inputClass} />
            {firstNameError && <p className="text-rose-400 text-xs px-1">{firstNameError}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <input type="text" placeholder={tr.lastName} value={lastName}
              onChange={(e) => { setLastName(e.target.value); validateLastName(e.target.value); }} className={inputClass} />
            {lastNameError && <p className="text-rose-400 text-xs px-1">{lastNameError}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <input type="email" placeholder={tr.email} value={email}
              onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} className={inputClass} />
            {emailError && <p className="text-rose-400 text-xs px-1">{emailError}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <input type="password" placeholder={tr.password} value={password}
              onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }} className={inputClass} />
            {passwordError && <p className="text-rose-400 text-xs px-1">{passwordError}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <input type="password" placeholder={tr.confirmPassword} value={confirmedPassword}
              onChange={(e) => { setConfirmedPassword(e.target.value); validateConfirmedPassword(e.target.value); }} className={inputClass} />
            {confirmedPasswordError && <p className="text-rose-400 text-xs px-1">{confirmedPasswordError}</p>}
          </div>
          <button type="submit" className="mt-4 bg-stone-800 hover:bg-stone-900 text-white p-3 rounded-full text-sm tracking-widest transition">
            {tr.registerBtn}
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-6">
          {tr.hasAccount}
          <a href="/login" className="text-stone-600 hover:text-stone-800 transition ml-1">{tr.login}</a>
        </p>
      </div>
    </div>
  );
}
