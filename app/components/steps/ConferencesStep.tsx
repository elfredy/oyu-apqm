"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  ConferenceScope,
  ConferenceRole,
} from "./types";

interface Props {
  form: UseFormReturn<ApqmFormValues>;
}

export function ConferencesStep({ form }: Props) {
  const { control, register, getValues, setValue, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conferences",
  });

  const conferences = watch("conferences") || [];

  const addConference = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      place: "",
      scope: "WOS_SCOPUS" as ConferenceScope,
      role: "SPEAKER" as ConferenceRole,
      year: new Date().getFullYear(),
      basePoints: 0,
      points: 0,
    });
  };

  const calcBasePoints = (scope: ConferenceScope, role: ConferenceRole) => {
    // IV. KONFRANS / KONGRES / SİMPOZİUM

    // 1️⃣ WOS / SCOPUS indeksli konfranslar
    if (scope === "WOS_SCOPUS") {
      switch (role) {
        case "CHAIR": // Sədr / həmsədr
          return 20;
        case "KEYNOTE": // Əsas məruzəçi
          return 15;
        case "SECTION_CHAIR": // Bölmə sədri
          return 6;
        case "SPEAKER": // Məruzəçi
          return 5;
        case "ORG_COMMITTEE": // Təşkilat komitəsi (sədri/müavini/üzvü)
          return 10; // 10/7/4-dən 10 götürmüşük
        case "ORG_COMMITTEE_MEM": // Təşkilat komitəsi (sədri/müavini/üzvü)
          return 7; // 10/7/4-dən 10 götürmüşük
        case "PARTICIPANT": // İştirakçı (məruzəsiz)
          return 3;
        case "MODERATOR":
          return 0; // WOS/SCOPUS üçün verilməyib
        default:
          return 0;
      }
    }

    // 2️⃣ Digər beynəlxalq konfranslar (4.2)
    if (scope === "OTHER_INTERNATIONAL") {
      switch (role) {
        case "ORG_COMMITTEE":
          // 8/5/3 – maksimumu götürək
          return 8;
        case "SPEAKER": // Məruzəçi
          return 3;
        case "PARTICIPANT": // İştirakçı (məruzəsiz)
          return 3;
        case "MODERATOR": // Moderator
          return 3;

        // Sədr / əsas məruzəçi / bölmə sədri üçün də 8/5/3 pattern verək
        case "CHAIR":
          return 15;
        case "KEYNOTE":
          return 12;
        case "SECTION_CHAIR":
          return 3;
        default:
          return 0;
      }
    }

    return 0;
  };

  const recalcPoints = (index: number) => {
    const scope = getValues(
      `conferences.${index}.scope` as const
    ) as ConferenceScope;

    const role = getValues(
      `conferences.${index}.role` as const
    ) as ConferenceRole;

    const base = calcBasePoints(scope, role);
    setValue(`conferences.${index}.basePoints`, base);
    setValue(`conferences.${index}.points`, base);
  };

  const totalConferencePoints = conferences.reduce(
    (sum, c) => sum + (c?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">
        IV. Konfrans / Kongres / Simpozium
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          {/* Ad + Yer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Tədbirin adı</label>
              <input
                {...register(`conferences.${index}.name` as const)}
                className="border p-2 rounded"
                placeholder="Konfrans / simpozium adı"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm">Yer (ölkə / şəhər)</label>
              <input
                {...register(`conferences.${index}.place` as const)}
                className="border p-2 rounded"
                placeholder="Məs: Bakı, Azərbaycan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Scope */}
            <div className="flex flex-col">
              <label className="text-sm">Tip</label>
              <select
                {...register(`conferences.${index}.scope` as const, {
                  onChange: () => recalcPoints(index),
                })}
                className="border p-2 rounded"
              >
                <option value="WOS_SCOPUS">
                  WOS/SCOPUS indeksli konfrans
                </option>
                <option value="OTHER_INTERNATIONAL">
                  Digər beynəlxalq konfrans
                </option>
              </select>
            </div>

            {/* Rol */}
            <div className="flex flex-col">
              <label className="text-sm">Rol</label>
              <select
                {...register(`conferences.${index}.role` as const, {
                  onChange: () => recalcPoints(index),
                })}
                className="border p-2 rounded"
              >
                <option value="CHAIR">Sədr / həmsədr</option>
                <option value="KEYNOTE">Əsas məruzəçi (keynote)</option>
                <option value="SECTION_CHAIR">Bölmə sədri</option>
                <option value="SPEAKER">Məruzəçi</option>
                <option value="ORG_COMMITTEE">
                  Təşkilat komitəsi (sədri/müavini)
                </option>
                <option value="ORG_COMMITTEE_MEM">
                  Təşkilat komitəsi (üzvü)
                </option>
                <option value="PARTICIPANT">İştirakçı (məruzəsiz)</option>
                <option value="MODERATOR">Moderator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`conferences.${index}.year`, {
                  valueAsNumber: true,
                })}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-sm">
                Bal:{" "}
                <span className="font-semibold">
                  {conferences[index]?.points ?? 0}
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
      ))}

      <div className="flex items-center justify-between pt-2 border-t">
        <button
          type="button"
          onClick={addConference}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni konfrans əlavə et
        </button>

        <p className="text-sm">
          Cəmi konfrans balı:{" "}
          <span className="font-semibold">
            {totalConferencePoints.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}