"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, CertificateCategory } from "./types";

const CERTIFICATE_LIST: Record<string, string[]> = {
  it: [
    "CompTIA A+",
    "Cisco CCNA",
    "AWS Cloud Practitioner",
  ],
  english: [
    "IELTS",
    "TOEFL iBT",
    "Cambridge C1 Advanced (CAE)",
    "Duolingo English Test",
    "TESOL",
  ],
  economics: [
    "Certified Business Economist (CBE)",
    "Economics for Managers (Harvard Online)",
    "Economic Development Certificate (CEcD)",
  ],
  business: [
    "Project Management Professional (PMP)",
    "Certified Business Manager (CBM)",
    "Mini-MBA",
  ],
  management: [
    "PMP",
    "PRINCE2 Practitioner",
    "Certified Manager (CM)",
  ],
  biology: [
    "ASCP Biologist Certification",
    "Biotechnology Certificate (MIT/Harvard)",
    "Molecular Biology Techniques Certificate",
  ],
  ecology: [
    "Certified Ecologist (ESA)",
    "Environmental Management Certificate",
    "Environmental Impact Assessment (EIA)",
  ],
  finance: [
    "CFA",
    "CPA",
    "ACCA",
  ],
  marketing: [
    "Google Digital Marketing & E-Commerce",
    "HubSpot Inbound Marketing",
    "Meta Digital Marketing Associate",
  ],
  design: [
    "Adobe Certified Professional (ACP)",
    "Google UX Design Certificate",
    "Graphic Design Specialization – CalArts",
  ],
};

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
      category: "top",
      year: new Date().getFullYear(),
      points: 10, // default
    });
  };

  // 🔥 Hər seçimdə balı 10 edirik
  const setFixedPoints = (index: number) => {
    setValue(`certificates.${index}.points`, 10);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sertifikatlar</h2>

      {fields.map((field, index) => {
        const fieldKey = certificates[index]?.field || "it";
        const options = CERTIFICATE_LIST[fieldKey] || [];

        return (
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
                onChange={(e) => {
                  setValue(`certificates.${index}.field`, e.target.value);
                  setValue(`certificates.${index}.title`, "");
                  setFixedPoints(index);
                }}
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
              <select
                {...register(`certificates.${index}.title` as const)}
                className="border p-2 rounded"
                onChange={() => setFixedPoints(index)}
              >
                <option value="">Seçin...</option>
                {options.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Bal */}
              <div className="flex flex-col justify-end">
                <p className="text-sm">
                  Bal:{" "}
                  <span className="font-semibold">
                    {certificates[index]?.points ?? 0}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 text-sm"
            >
              Sil
            </button>
          </div>
        );
      })}

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