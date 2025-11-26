// app/admin/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";

interface SubmissionListItem {
  id: string;
  fullName: string;
  fin: string;
  academicYear?: string;
  createdAt?: string;
}

// 🔐 Sadə admin giriş məlumatları (buradan dəyişə bilərsən)
const ADMIN_USERNAME = "adminsec";
const ADMIN_PASSWORD = "OyuSecdata2025!";

export default function AdminListPage() {
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (
      loginUsername === ADMIN_USERNAME &&
      loginPassword === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("İstifadəçi adı və ya şifrə yanlışdır.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return; // 🔐 Login olmadan data çəkilmir

    const loadSubmissions = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "apqmSubmissions"));
        const snap = await getDocs(q);

        const items: SubmissionListItem[] = snap.docs.map((doc) => {
          const data = doc.data() as any;
          const personal = data.personalInfo || {};

          return {
            id: doc.id,
            fullName: personal.fullName || "—",
            fin: personal.fin || "—",
            academicYear: personal.academicYear || "",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleString("az-Latn-AZ")
              : "",
          };
        });

        setSubmissions(items);
      } catch (error) {
        console.error("Admin list load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [isAuthenticated]);

  // 🔐 Əgər login olunmayıbsa – əvvəlcə giriş formu göstər
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4">
          <h1 className="text-xl font-bold text-center mb-2">
            APQM – Admin girişi
          </h1>
          <p className="text-xs text-slate-500 text-center mb-4">
            Yalnız səlahiyyətli şəxslər üçün nəzərdə tutulub.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">İstifadəçi adı</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Məs: oyu-admin"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1">Şifrə</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şifrəni daxil edin"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Giriş et
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ✅ Login olunubsa – siyahını göstər
  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          APQM – Müraciət edən müəllimlər
        </h1>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(false);
            setLoginPassword("");
            setLoginUsername("");
          }}
          className="text-xs text-slate-600 hover:text-red-600"
        >
          Çıxış
        </button>
      </div>

      {loading && <p>Yüklənir...</p>}

      {!loading && submissions.length === 0 && (
        <p className="text-sm text-slate-600">
          Hələlik heç bir müəllim formu doldurmayıb.
        </p>
      )}

      {!loading && submissions.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-3 py-2 text-left">Ad, soyad</th>
                <th className="border px-3 py-2 text-left">FIN</th>
                <th className="border px-3 py-2 text-left">
                  Akademik il
                </th>
                <th className="border px-3 py-2 text-left">Tarix</th>
                <th className="border px-3 py-2 text-center">Ətraflı</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="border px-3 py-2">{s.fullName}</td>
                  <td className="border px-3 py-2">{s.fin}</td>
                  <td className="border px-3 py-2">
                    {s.academicYear || "—"}
                  </td>
                  <td className="border px-3 py-2">
                    {s.createdAt || "—"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <Link
                      href={`/admin/${s.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Bax
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}