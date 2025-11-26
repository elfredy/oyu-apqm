// app/admin/[id]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { ApqmFormValues } from "../../components/steps/types";

interface SubmissionFromDb extends ApqmFormValues {
  totalArticlePoints?: number;
  totalBookPoints?: number;
  grandTotalPoints?: number;
  createdAt?: any;
}

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<SubmissionFromDb | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const ref = doc(db, "apqmSubmissions", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setData(null);
        } else {
          setData(snap.data() as SubmissionFromDb);
        }
      } catch (err) {
        console.error("Admin detail load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const {
    sectionTotals,
    grandTotalComputed,
  } = useMemo(() => {
    if (!data) {
      return {
        sectionTotals: {} as Record<string, number>,
        grandTotalComputed: 0,
      };
    }

    const sumPoints = (arr?: { points?: number }[]) =>
      (arr || []).reduce((s, item) => s + (item.points || 0), 0);

    const totals: Record<string, number> = {
      books: sumPoints(data.books),
      articles: sumPoints(data.articles),
      projects: sumPoints(data.projects as any),
      conferences: sumPoints(data.conferences as any),
      seminars: sumPoints(data.seminars as any),
      translations: sumPoints(data.translations as any),
      editorialReviews: sumPoints(data.editorialReviews as any),
      awards: sumPoints(data.awards as any),
      dissertations: sumPoints(data.dissertations as any),
      academicBodies: sumPoints(data.academicBodies as any),
      jury: sumPoints(data.juries as any),
      patents: sumPoints(data.patents as any),
      representation: sumPoints(data.representations as any),
      academicPositions: sumPoints(data.academicPositions as any),
      artsActivities: sumPoints(data.artsActivities as any),
      artsAwards: sumPoints(data.artsAwards as any),
      certificates: sumPoints(data.certificates as any),
    };

    const grand =
      Object.values(totals).reduce((s, v) => s + v, 0) ||
      data.grandTotalPoints ||
      0;

    return {
      sectionTotals: totals,
      grandTotalComputed: grand,
    };
  }, [data]);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto py-8 px-4">
        <p>Yüklənir...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-5xl mx-auto py-8 px-4">
        <p className="mb-4 text-sm text-red-600">
          Məlumat tapılmadı və ya silinib.
        </p>
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 text-sm rounded-md border"
        >
          Siyahıya qayıt
        </button>
      </main>
    );
  }

  const p = data.personalInfo;

  return (
    <main className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Müəllim – {p.fullName || "—"}
        </h1>
        <button
          onClick={() => router.push("/admin")}
          className="px-3 py-1.5 text-sm rounded-md border"
        >
          Geri – siyahıya
        </button>
      </div>

      {/* Şəxsi məlumatlar kartı */}
      <div className="border rounded-lg p-4 bg-slate-50 text-sm space-y-1">
        <p>
          <span className="font-semibold">FIN:</span> {p.fin || "—"}
        </p>
        <p>
          <span className="font-semibold">Universitet:</span>{" "}
          {p.university}
        </p>
        <p>
          <span className="font-semibold">Fakültə:</span>{" "}
          {p.faculty || "—"}
        </p>
        <p>
          <span className="font-semibold">Kafedra:</span>{" "}
          {p.department || "—"}
        </p>
        <p>
          <span className="font-semibold">Akademik il:</span>{" "}
          {p.academicYear || "—"}
        </p>
      </div>

      {/* Bölmə-bölmə ballar xülasəsi */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Bölmələr üzrə bal cədvəli</h2>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border px-3 py-2 text-left">Bölmə</th>
              <th className="border px-3 py-2 text-right">Bal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-3 py-2">I. Kitablar</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.books.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">II. Məqalələr</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.articles.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">III. Layihələr</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.projects.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                IV. Konfrans / kongres / simpozium
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.conferences.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                V. Seminar / sosial fəaliyyət
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.seminars.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                VI–VII. Tərcümə, redaktorluq, rəyçilik
              </td>
              <td className="border px-3 py-2 text-right">
                {(sectionTotals.translations +
                  sectionTotals.editorialReviews
                ).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">VIII. Mükafatlar</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.awards.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">IX. Dissertasiyalar</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.dissertations.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                X. Elmi şuralar və təşkilatlar
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.academicBodies.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">XI. Jüri</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.jury.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">XII. Patent / yeni məhsul</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.patents.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">XIII. OYU-nu təmsil etmə</td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.representation.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                XIV. Akademik və idarəetmə vəzifələri
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.academicPositions.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                XVII. Sənətşünaslıq fəaliyyəti
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.artsActivities.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                XIX. Sənətşünaslıq mükafatı
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.artsAwards.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2">
                Sertifikatlar (əlavə)
              </td>
              <td className="border px-3 py-2 text-right">
                {sectionTotals.certificates.toFixed(2)}
              </td>
            </tr>

            {/* Yekun sətir */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border px-3 py-2">Ümumi bal (yekun)</td>
              <td className="border px-3 py-2 text-right">
                {grandTotalComputed.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}