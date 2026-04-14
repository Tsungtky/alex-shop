"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Toast from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthday: string;
  phoneCountryCode: string;
  phone: string;
  country: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
};

const PHONE_CODES = [
  { code: "+886", label: "+886 (TW)" },
  { code: "+81", label: "+81 (JP)" },
  { code: "+82", label: "+82 (KR)" },
  { code: "+1", label: "+1 (US)" },
  { code: "+66", label: "+66 (TH)" },
];

const getCountries = (tr: any) => [
  { code: "Taiwan", label: tr.taiwan },
  { code: "Japan", label: tr.japan },
  { code: "Korea", label: tr.korea },
  { code: "USA", label: tr.usa },
  { code: "Thailand", label: tr.thailand },
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const inputClass =
  "border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition w-full";
const selectClass =
  "border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none focus:border-stone-500 text-stone-700 text-sm transition w-full";
const labelClass = "text-xs text-stone-400 tracking-widest mb-1";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const { lang } = useLanguage();
  const tr = t[lang];
  const COUNTRIES = getCountries(tr);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    api.get(`/api/users/${userId}`).then((res) => {
      setUser({ phoneCountryCode: "+81", ...res.data });
    });
  }, []);

  const handleSave = async () => {
    try {
      await api.put("/api/users", user);
      setToast({ message: tr.saveSuccess, type: "success" });
    } catch {
      setToast({ message: tr.saveFailed, type: "error" });
    }
  };

  const set = (field: keyof User, value: string) => {
    setUser((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirm) {
      setToast({ message: tr.passwordMismatch, type: "error" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setToast({ message: tr.passwordTooShort, type: "error" });
      return;
    }
    try {
      await api.put(`/api/users/${user!.id}/change-password`, {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      localStorage.clear();
      router.push("/login");
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || tr.passwordChangeFailed, type: "error" });
    }
  };

  if (!user) return null;

  const showState = user.country === "US";

  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-10">{tr.profile}</h1>

      <div className="flex flex-col gap-8">

        {/* 基本情報 */}
        <section className="flex flex-col gap-6">
          <p className="text-xs tracking-widest text-stone-400 uppercase">{tr.basicInfo}</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className={labelClass}>First Name</p>
              <input className={inputClass} value={user.firstName ?? ""} onChange={(e) => set("firstName", e.target.value)} />
            </div>
            <div>
              <p className={labelClass}>Last Name</p>
              <input className={inputClass} value={user.lastName ?? ""} onChange={(e) => set("lastName", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className={labelClass}>性別</p>
              <select className={selectClass} value={user.gender ?? ""} onChange={(e) => set("gender", e.target.value)}>
                <option value="">未選択</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <p className={labelClass}>生年月日</p>
              <input type="date" className={inputClass} value={user.birthday ?? ""} onChange={(e) => set("birthday", e.target.value)} />
            </div>
          </div>
          <div>
            <p className={labelClass}>メールアドレス</p>
            <input className={inputClass} value={user.email ?? ""} disabled />
          </div>
          <div>
            <p className={labelClass}>電話番号</p>
            <div className="flex gap-2">
              <select
                className="border-0 border-b border-stone-200 bg-transparent p-3 focus:outline-none focus:border-stone-500 text-stone-700 text-sm transition"
                value={user.phoneCountryCode ?? "+81"}
                onChange={(e) => set("phoneCountryCode", e.target.value)}
              >
                {PHONE_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                className={inputClass}
                placeholder="90-0000-0000"
                value={user.phone ?? ""}
                onChange={(e) => set("phone", e.target.value.replace(/^0+/, ""))}
              />
            </div>
          </div>
        </section>

        {/* 住所 */}
        <section className="flex flex-col gap-6">
          <p className="text-xs tracking-widest text-stone-400 uppercase">{tr.address}</p>
          <div>
            <p className={labelClass}>国</p>
            <select className={selectClass} value={user.country ?? ""} onChange={(e) => set("country", e.target.value)}>
              <option value="">{tr.selectCountry}</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className={labelClass}>住所</p>
            <input className={inputClass} placeholder="1-2-3 Shibuya" value={user.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <p className={labelClass}>アパート・部屋番号（任意）</p>
            <input className={inputClass} placeholder="Apt 4B" value={user.apartment ?? ""} onChange={(e) => set("apartment", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className={labelClass}>市区町村</p>
              <input className={inputClass} placeholder="Shibuya-ku" value={user.city ?? ""} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <p className={labelClass}>郵便番号</p>
              <input className={inputClass} placeholder="150-0001" value={user.postalCode ?? ""} onChange={(e) => set("postalCode", e.target.value)} />
            </div>
          </div>
          {showState && (
            <div>
              <p className={labelClass}>州</p>
              <select className={selectClass} value={user.state ?? ""} onChange={(e) => set("state", e.target.value)}>
                <option value="">選択してください</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </section>

        <button
          onClick={handleSave}
          className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-10 rounded-full text-sm tracking-widest transition self-end"
        >
          {tr.save}
        </button>

        {/* パスワード変更 */}
        <section className="flex flex-col gap-6 border-t border-stone-100 pt-8">
          <p className="text-xs tracking-widest text-stone-400 uppercase">{tr.changePassword}</p>
          <div>
            <p className={labelClass}>{tr.currentPassword}</p>
            <input
              type="password"
              className={inputClass}
              value={pwForm.oldPassword}
              onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
            />
          </div>
          <div>
            <p className={labelClass}>{tr.newPassword}</p>
            <input
              type="password"
              className={inputClass}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            />
          </div>
          <div>
            <p className={labelClass}>{tr.confirmPassword}</p>
            <input
              type="password"
              className={inputClass}
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-10 rounded-full text-sm tracking-widest transition self-end"
          >
            {tr.changePasswordBtn}
          </button>
        </section>
      </div>
    </div>
  );
}
