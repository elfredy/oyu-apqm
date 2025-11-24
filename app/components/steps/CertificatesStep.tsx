"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, CertificateCategory } from "./types";

interface Props {
  form: UseFormReturn<ApqmFormValues>;
}

export function CertificatesStep({ form }: Props) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates",
  });

  const certificates = watch("certificates") || [];

  const addCertificate = () => {
    append({
      id: crypto.randomUUID(),
      field: "it",
      title: "",
      category: "top" as CertificateCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (category: CertificateCategory) => {
    switch (category) {
      case "top":
        return 10; // PMP, CFA, CCNA, IELTS...
      case "medium":
        return 7;  // TOEFL, Google UX, HubSpot...
      case "basic":
        return 4;  // Duolingo, Mini-MBA...
      default:
        return 0;
    }
  };

  const recalc = (index: number) => {
    const category = certificates[index]?.category as CertificateCategory;
    setValue(`certificates.${index}.points`, calcPoints(category));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sertifikatlar</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 bg-slate-50 rounded-lg space-y-4"
        >
          {/* Sahə seçimi */}
          <div className="flex flex-col">
            <label className="text-sm">Sahə</label>
            <select
              {...register(`certificates.${index}.field` as const)}
              className="border p-2 rounded"
            >
              <option value="it">Information Technology</option>
              <option value="english">English Language</option>
              <option value="economics">Economics</option>
              <option value="business">Business</option>
              <option value="management">Management</option>
              <option value="biology">Biology</option>
              <option value="ecology">Ecology</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="design">Graphic Design / UX</option>
            </select>
          </div>

          {/* Sertifikatın adı */}
          <div className="flex flex-col">
            <label className="text-sm">Sertifikatın adı</label>
            <input
              {...register(`certificates.${index}.title`)}
              className="border p-2 rounded"
              placeholder="Sertifikatın tam adı"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kateqoriya */}
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(`certificates.${index}.category` as const)}
                className="border p-2 rounded"
                onChange={() => recalc(index)}
              >
                <option value="top">Top (PMP, CFA, CCNA, IELTS…)</option>
                <option value="medium">Orta (TOEFL, Google UX…)</option>
                <option value="basic">Əsas (Duolingo, Mini-MBA…)</option>
              </select>
            </div>

            {/* İl */}
            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`certificates.${index}.year`, {
                  valueAsNumber: true,
                })}
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Puan */}
          <div className="text-sm">
            Bal:{" "}
            <span className="font-semibold">
              {certificates[index]?.points ?? 0}
            </span>
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 text-sm"
          >
            Sil
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addCertificate}
        className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
      >
        + Yeni sertifikat əlavə et
      </button>
    </div>
  );
}